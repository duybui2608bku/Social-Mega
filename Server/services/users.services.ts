import { RegisterRequestBody, updateMeRequestBody } from '~/models/requestes/User.requests'
import databaseService from '../services/database.services'
import User from '../src/models/schemas/User.schema'
import { hashPassword } from '~/utils/crypro'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import { RefreshToken } from '~/models/schemas/RefreshToekn.chema'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
import { userMessages } from '~/constants/messages'
import Fllowers from '~/models/schemas/Fllowers.chema'
config()

class UsersService {
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken, verify },
      priveKey: process.env.JWT_SECRET_ACCESSTOKEN as string,
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN, algorithm: 'HS256' }
    })
  }

  private signRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken, verify },
      priveKey: process.env.JWT_SECRET_REFRESHTOKEN as string,
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN, algorithm: 'HS256' }
    })
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerifyToken, verify },
      priveKey: process.env.JWT_SECRET_EMAIL_VERIFYTOKEN as string,
      options: { expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN, algorithm: 'HS256' }
    })
  }

  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.ForgotPasswordToken, verify },
      priveKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: { expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN, algorithm: 'HS256' }
    })
  }

  async register(payload: RegisterRequestBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverify
    })
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        date_of_birth: new Date(payload.date_of_birth),
        email_verify_token,
        password: hashPassword(payload.password)
      })
    )

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverify
    })
    databaseService.refreshTokens.insertOne(new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token }))

    return { access_token, refresh_token, email_verify_token }
  }

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      verify
    })
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )
    return { access_token, refresh_token }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: userMessages.LOGOUT_SUCCESS
    }
  }

  async checkEmail(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async verifyEmail(user_id: string) {
    const [token, _] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id, verify: UserVerifyStatus.Verified }),
      databaseService.users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        {
          $set: { email_verify_token: '', verify: UserVerifyStatus.Verified },
          $currentDate: { updated_at: true }
        }
      )
    ])
    const [access_token, refresh_token] = token
    return {
      message: userMessages.EMAIL_VERIFIED
    }
  }

  async resendEmailVerify(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken({
      user_id,
      verify: UserVerifyStatus.Unverify
    })
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: { email_verify_token },
        $currentDate: { updated_at: true }
      }
    )
    return {
      message: userMessages.EMAIL_VERIFY_RESEND_SUCCESS
    }
  }

  async forgotPassword({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const forgot_password_token = await this.signForgotPasswordToken({
      user_id,
      verify
    })
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: { forgot_password_token },
        $currentDate: { updated_at: true }
      }
    )
    // Send email to user : https://example.com/reset-password

    return {
      message: userMessages.CHECK_EMAIL_FOR_RESET_PASSWORD
    }
  }

  async resetPassword(user_id: string, password: string) {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: { password: hashPassword(password), forgot_password_token: '' },
        $currentDate: { updated_at: true }
      }
    )
    return {
      message: userMessages.RESET_PASSWORD_SUCCESS
    }
  }
  async getProfile(user_id: string) {
    const user = await databaseService.users.findOne(
      {
        _id: new ObjectId(user_id)
      },
      { projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
    )
    if (!user) {
      return {
        message: userMessages.USER_NOT_FOUND
      }
    }
    return {
      message: userMessages.GET_PROFILE_SUCCESS,
      user
    }
  }
  async updateProfile(user_id: string, payload: updateMeRequestBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const user = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          ...(_payload as updateMeRequestBody & { date_of_birth: Date })
        },
        $currentDate: { updated_at: true }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async follow(user_id: string, flow_user_id: string) {
    const fllower = await databaseService.fllowers.findOne({
      user_id: new ObjectId(user_id),
      flow_user_id: new ObjectId(flow_user_id)
    })
    console.log(fllower)
    if (fllower === null) {
      await databaseService.fllowers.insertOne(
        new Fllowers({ user_id: new ObjectId(user_id), flow_user_id: new ObjectId(flow_user_id) })
      )
      return {
        message: userMessages.FLLOW_USER_SUCCESS
      }
    }
    return {
      message: userMessages.USER_FLLOWERED
    }
  }
}

const usersService = new UsersService()
export default usersService

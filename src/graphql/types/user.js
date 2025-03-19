export const typeDefs = `#graphql
 type User {
  id: ID!
  firstName: String
  lastName: String
  email: String!
  password: String!
  role: String!
  emailIsVerified: Boolean!
  phoneNumber: String
  dateOfBirth: String
  businessType: String
  businessAddress: String
  gymAffiliation: String
  stageName: String
  location: Location

}

type Location {
  country: String
  city: String
}

input LocationInput {
  country: String
  city: String
}

type AuthPayload {
  accessToken: String!
  refreshToken: String!
  user: User!
}

type RefreshTokenPayload {
  accessToken: String!
  user: User!
}

type RegisterUserResponse {
  message: String!
  accessToken: String!
  refreshToken: String!
}

type MessageResponse {
  message: String!
}

type Mutation {
  registerUser(
    firstName: String
    lastName: String
    email: String!
    password: String!
    role: String!
    phoneNumber: String
    dateOfBirth: String
    businessType: String
    businessAddress: String
    gymAffiliation: String
    stageName: String
    location: LocationInput
  ): RegisterUserResponse!

  verifyEmail(email: String!, code: String!): MessageResponse!
  resendVerificationCode(email: String!): MessageResponse!
  loginUser(email: String!, password: String!): AuthPayload!
  refreshToken: RefreshTokenPayload!
  logout: MessageResponse!

  updateUserProfile(
    firstName: String
    lastName: String
    phoneNumber: String                              
    dateOfBirth: String
    businessType: String
    businessAddress: String
    gymAffiliation: String
    stageName: String
    location: LocationInput 
  ): User!

  requestPasswordReset(email: String!): MessageResponse!
  resetPassword(email: String!, newPassword: String!,confirmPassword: String!, token: String!): MessageResponse!
}

`;

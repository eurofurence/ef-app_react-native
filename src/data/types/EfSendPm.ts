export type EfSendPm = {
  type?: 'byRegistrationId' | 'byIdentityId'
  recipientUid: string
  authorName: string
  toastTitle: string
  toastMessage: string
  subject: string
  message: string
}

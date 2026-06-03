/**
 * API user data.
 */
export type EfUser = {
  Roles: string[]
  Registrations: {
    Id: string
    Status: string
  }[]
}

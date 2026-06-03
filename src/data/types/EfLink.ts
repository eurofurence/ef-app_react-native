export type EfLink = {
  Id: string
  FragmentType:
    | 'WebExternal'
    | 'MapExternal'
    | 'MapEntry'
    | 'DealerDetail'
    | 'EventConferenceRoom'
  Name: string
  Target: string
}

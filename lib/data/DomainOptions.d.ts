interface DomainOptions {
  getIP?: typeof getIP
  errorFormat?: typeof errorFormat
  // getError?: typeof errorFormat;
  serverUrl?: string
  domainId?: number
  domainName: string
  loginId: number
  loginToken: string
}

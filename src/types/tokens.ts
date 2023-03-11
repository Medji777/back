export type TokensModel = {
    userId: string,
    token: string
}

export type RefreshPayloadType = {
    userId: string,
    deviceId: string,
}
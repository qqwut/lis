export interface IUserItem {
    token?: string
    userAD?: string
    userLis?: string
    email?: string
    roleid?: string
    success?: true
}

export interface IResLogin {
    token: string
    userAD: string
    userLis: string
    email: string
    roleid: string
    success: boolean
}

export interface IReqLogin {
    username: string
    password: string
}
export const app = cloudbase.init({
  env: 'ai-tools-6guwawtsb724a7e7',
})
export const auth = app.auth({
  persistence: "local" //用户显式退出或更改密码之前的30天一直有效
})
export const db = app.database()

export async function onLoginAnonymous() {
  // 调用匿名登录接口
  const ret = await auth.anonymousAuthProvider().signIn()
  // 匿名登录成功后，登录状态isAnonymous字段值为true
  // const loginState = await auth.getLoginState()
  // console.log(loginState.isAnonymousAuth) // true
  document.dispatchEvent(new Event('login'))
}
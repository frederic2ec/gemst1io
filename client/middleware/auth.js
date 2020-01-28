export default function(context) {
  const { store, redirect } = context
  const { auth, login } = store.state

  if (!auth.payload && !login.logged) {
    return redirect('/account/login')
  }
}

export default function(context) {
  const { store, redirect } = context
  const { auth } = store.state

  if (auth.payload) {
    return redirect('/dash')
  }
}

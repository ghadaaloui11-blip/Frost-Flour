// Log in / Sign up (US-01, US-02)
// TODO: Two tabs: 'Log in' (email, password) and 'Sign up' (first name, last name, email, phone, address, password). Use login() / register() from useAuth(), then go to the catalog (client) or /agent/orders (agent).
import PagePlaceholder from '../../components/PagePlaceholder'

export default function LoginPage() {
  return <PagePlaceholder title="Log in / Sign up" stories="US-01, US-02" />
}

import { signup, loginWithFacebook } from '../auth/actions'
import Link from 'next/link'
import Navbar from "../../components/navbar";

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const { error } = await searchParams

    return (
        <>
            <Navbar user={null} />
            <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', fontFamily: 'sans-serif' }}>
                <h2>Create Account</h2>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

                    <div>
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input id="confirmPassword" name="confirmPassword" type="password" required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>

                    <button formAction={signup} style={{ padding: '10px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
                        Register
                    </button>
                </form>

                <div style={{ textAlign: 'center', color: '#888', margin: '10px 0' }}>or</div>

                <form action={loginWithFacebook} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button type="submit" style={{ padding: '10px', background: '#1877F2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Continue with Facebook
                    </button>
                </form>
                <p style={{ fontSize: '14px', marginTop: '15px' }}>
                    Already have an account? <Link href="/login" style={{ color: '#0070f3' }}>Log in</Link>
                </p>
            </div>

        </>
    )
}
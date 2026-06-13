'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        return redirect('/login?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Manual check to ensure passwords match before calling Supabase
    if (password !== confirmPassword) {
        return redirect('/register?error=' + encodeURIComponent("Passwords do not match."))
    }

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
        return redirect('/register?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    redirect('/login?message=' + encodeURIComponent("Registration successful. Please log in."))
}

export async function loginWithFacebook() {
    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    // Requests the Facebook OAuth URL from Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        return redirect('/login?error=' + encodeURIComponent(error.message))
    }

    if (data.url) {
        redirect(data.url) // Sends the user to Facebook to authorize
    }
}
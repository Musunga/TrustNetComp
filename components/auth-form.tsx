"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { login as loginAction } from "@/lib/actions/auth"
import { ACCESS_TOKEN_COOKIE_NAME } from "@/lib/constants/variables"

export function AuthForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [step, setStep] = React.useState(0)
  const totalSteps = 9
  const [showPassword, setShowPassword] = React.useState(false)
  const [loginError, setLoginError] = React.useState<string | null>(null)
  const [values, setValues] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    jobTitle: "",
    timezone: "",
    bio: "",
    companyName: "",
    companySize: "",
    industry: "",
    companyPhoneNumber: "",
    companyEmail: "",
    companyCountry: "",
    companyCity: "",
  })
  const [error, setError] = React.useState<string | null>(null)

  async function onLoginSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setLoginError(null)
    setIsLoading(true)
    const form = event.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const email = (formData.get("email") as string) ?? ""
    const password = (formData.get("password") as string) ?? ""
    try {
      const data = await loginAction(email, password)
      console.log("data", data)
      // Store the access token in a cookie so middleware and API calls recognize the user
      const maxAge = 60 * 60 * 24 // 24 hours
      document.cookie = `${ACCESS_TOKEN_COOKIE_NAME}=${encodeURIComponent(data.token)}; path=/; max-age=${maxAge}; SameSite=Lax`
      router.push("/dashboard")
    } catch (_err) {
      setLoginError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function onRegisterSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    // Only submit on final step
    if (step < totalSteps - 1) return
    setIsLoading(true)
    const payload = { ...values }
    // TODO: Replace with actual API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function validateCurrentStep(): boolean {
    setError(null)
    // Minimal validation for key fields on their steps
    if (step === 0) {
      if (!values.firstName || !values.lastName) {
        setError("Please enter your first and last name.")
        return false
      }
    }
    if (step === 1) {
      if (!values.email) {
        setError("Please enter a valid email address.")
        return false
      }
    }
    if (step === 2) {
      if (!values.password) {
        setError("Please create a password.")
        return false
      }
    }
    if (step === 5) {
      if (!values.companyName) {
        setError("Please enter your company name.")
        return false
      }
    }
    return true
  }

  function onNext() {
    if (!validateCurrentStep()) return
    setStep((s) => Math.min(s + 1, totalSteps - 1))
  }

  function onBack() {
    setError(null)
    setStep((s) => Math.max(s - 1, 0))
  }

  function StepHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
      <div className="space-y-1">
        <p className="text-lg font-medium">{title}</p>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
    )
  }

  function StepFooter() {
    return (
      <CardFooter className="mt-4 md:mt-6 flex items-center gap-2">
        {step > 0 ? (
          <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
            Back
          </Button>
        ) : null}
        {step < totalSteps - 1 ? (
          <Button type="button" onClick={onNext} disabled={isLoading}>
            {isLoading ? "Please wait..." : "Next"}
          </Button>
        ) : (
          <Button type="submit" disabled={isLoading} className="ml-auto">
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        )}
      </CardFooter>
    )
  }

  return (
    <div className="grid gap-6">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <div className="space-y-1 mb-3">
            <h3 className="text-xl font-semibold">Login</h3>
            <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
          </div>
          <Card>
            <form onSubmit={onLoginSubmit}>
              <CardContent className="space-y-6">
                {loginError ? (
                  <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert" aria-live="polite">
                    {loginError}
                  </div>
                ) : null}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
              </CardContent>
              <CardFooter className="mt-4 md:mt-6">
                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <div className="space-y-1 mb-3">
            <h3 className="text-xl font-semibold">Create Account</h3>
            <p className="text-sm text-muted-foreground">Sign up for a new company account</p>
          </div>
          <Card>
            <form onSubmit={onRegisterSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Step {step + 1} of {totalSteps}</span>
                  </div>
                  <Progress
                    value={Math.round(((step + 1) / totalSteps) * 100)}
                    className="h-2"
                    aria-label="Signup progress"
                  />
                </div>
                {error ? (
                  <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert" aria-live="polite">
                    {error}
                  </div>
                ) : null}
                {step === 0 && (
                  <div className="space-y-4">
                    <StepHeader title="What's your name?" subtitle="We’ll personalize your workspace." />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" placeholder="John" value={values.firstName} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" placeholder="Doe" value={values.lastName} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-4">
                    <StepHeader title="How can we reach you?" subtitle="Use your work email if possible." />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email-reg">Email</Label>
                        <Input id="email-reg" name="email" type="email" placeholder="john.doe@example.com" value={values.email} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input id="phoneNumber" name="phoneNumber" placeholder="+1234567890" value={values.phoneNumber} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4">
                    <StepHeader title="Secure your account" subtitle="Create a strong password." />
                    <div className="space-y-2">
                      <Label htmlFor="password-reg">Password</Label>
                      <div className="relative">
                        <Input
                          id="password-reg"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="SecurePassword123!"
                          value={values.password}
                          onChange={handleChange}
                          className="pr-16"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 px-2"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-4">
                    <StepHeader title="Your role and timezone" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input id="jobTitle" name="jobTitle" placeholder="CTO" value={values.jobTitle} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input id="timezone" name="timezone" placeholder="America/New_York" value={values.timezone} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                )}
                {step === 4 && (
                  <div className="space-y-4">
                    <StepHeader title="Tell us a bit about you" />
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input id="bio" name="bio" placeholder="Software engineer with 10 years of experience" value={values.bio} onChange={handleChange} />
                    </div>
                  </div>
                )}
                {step === 5 && (
                  <div className="space-y-4">
                    <StepHeader title="Company basics" />
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input id="companyName" name="companyName" placeholder="Acme Corporation" value={values.companyName} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="companySize">Company Size</Label>
                        <Input id="companySize" name="companySize" placeholder="50-100" value={values.companySize} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input id="industry" name="industry" placeholder="Technology" value={values.industry} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                )}
                {step === 6 && (
                  <div className="space-y-4">
                    <StepHeader title="Company contact details" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="companyPhoneNumber">Company Phone Number</Label>
                        <Input id="companyPhoneNumber" name="companyPhoneNumber" placeholder="+1234567890" value={values.companyPhoneNumber} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyEmail">Company Email</Label>
                        <Input id="companyEmail" name="companyEmail" type="email" placeholder="contact@acme.com" value={values.companyEmail} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                )}
                {step === 7 && (
                  <div className="space-y-4">
                    <StepHeader title="Where are you located?" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="companyCountry">Company Country</Label>
                        <Input id="companyCountry" name="companyCountry" placeholder="USA" value={values.companyCountry} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyCity">Company City</Label>
                        <Input id="companyCity" name="companyCity" placeholder="New York" value={values.companyCity} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                )}
                {step === 8 && (
                  <div className="space-y-4">
                    <StepHeader title="Review and create your account" subtitle="Confirm your details before creating your workspace." />
                    <div className="text-sm grid gap-2">
                      <div><span className="text-muted-foreground">Name:</span> {values.firstName} {values.lastName}</div>
                      <div><span className="text-muted-foreground">Email:</span> {values.email}</div>
                      <div><span className="text-muted-foreground">Phone:</span> {values.phoneNumber || "—"}</div>
                      <div><span className="text-muted-foreground">Job Title:</span> {values.jobTitle || "—"}</div>
                      <div><span className="text-muted-foreground">Timezone:</span> {values.timezone || "—"}</div>
                      <div><span className="text-muted-foreground">Bio:</span> {values.bio || "—"}</div>
                      <div><span className="text-muted-foreground">Company:</span> {values.companyName}</div>
                      <div><span className="text-muted-foreground">Size:</span> {values.companySize || "—"}</div>
                      <div><span className="text-muted-foreground">Industry:</span> {values.industry || "—"}</div>
                      <div><span className="text-muted-foreground">Company Phone:</span> {values.companyPhoneNumber || "—"}</div>
                      <div><span className="text-muted-foreground">Company Email:</span> {values.companyEmail || "—"}</div>
                      <div><span className="text-muted-foreground">Location:</span> {values.companyCity || "—"}, {values.companyCountry || "—"}</div>
                    </div>
                  </div>
                )}
              </CardContent>
              <StepFooter />
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

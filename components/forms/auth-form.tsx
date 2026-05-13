"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useSetAtom } from "jotai"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { login as loginAction, register as registerAction } from "@/lib/actions/auth"
import { getApiErrorMessage } from "@/lib/api"
import { authSessionFromLogin } from "@/lib/utils/auth-login-response"
import { ACCESS_TOKEN_COOKIE_NAME } from "@/lib/constants/variables"
import { authSessionAtom } from "@/lib/store/auth"

export function AuthForm() {
  const router = useRouter()
  const setAuthSession = useSetAtom(authSessionAtom)
  const [isLoading, setIsLoading] = React.useState(false)
  const [step, setStep] = React.useState(0)
  const totalSteps = 7
  const [showPassword, setShowPassword] = React.useState(false)
  const [showLoginPassword, setShowLoginPassword] = React.useState(false)
  const [loginError, setLoginError] = React.useState<string | null>(null)
  const [values, setValues] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    jobTitle: "",
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
      setAuthSession(authSessionFromLogin(data))
      if (data.token) {
        localStorage.setItem(ACCESS_TOKEN_COOKIE_NAME, data.token)
        const res = await fetch("/api/auth/set-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: data.token }),
        })
        if (!res.ok) {
          setLoginError("Session could not be established. Please try again.")
          return
        }
      }
      router.push("/dashboard")
    } catch (_err) {
      setLoginError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function onRegisterSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    if (step < totalSteps - 1) return
    setError(null)
    setIsLoading(true)
    try {
      const data = await registerAction({
        ...values,
        name: `${values.firstName} ${values.lastName}`.trim(),
      })
      if (data.token) {
        localStorage.setItem(ACCESS_TOKEN_COOKIE_NAME, data.token)
        const res = await fetch("/api/auth/set-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: data.token }),
        })
        if (!res.ok) {
          setError("Session could not be established. Please try again.")
          return
        }
      }
      if (data.user && Array.isArray(data.memberships)) {
        setAuthSession({
          ...authSessionFromLogin(data),
          message: typeof data.message === "string" && data.message.trim() ? data.message : "Account created",
        })
      }
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(getApiErrorMessage(err) ?? "Could not create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleSelectChange(name: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function validateCurrentStep(): boolean {
    setError(null)
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
    if (step === 4) {
      if (!values.companyName) {
        setError("Please enter your company name.")
        return false
      }
    }
    if (step === 6 && !values.companyCountry) {
      setError("Please select your company country.")
      return false
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
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
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
            <form onSubmit={onLoginSubmit} autoComplete="off">
              <CardContent className="space-y-6">
                {loginError ? (
                  <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert" aria-live="polite">
                    {loginError}
                  </div>
                ) : null}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" autoComplete="off" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showLoginPassword ? "text" : "password"}
                      autoComplete="off"
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-1/2 h-9 w-9 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowLoginPassword((v) => !v)}
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden />
                      )}
                    </Button>
                  </div>
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
            <form onSubmit={onRegisterSubmit} autoComplete="off">
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
                        <Input id="firstName" name="firstName" value={values.firstName} onChange={handleChange} autoComplete="off" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" value={values.lastName} onChange={handleChange} autoComplete="off" />
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
                        <Input id="email-reg" name="email" type="email" value={values.email} onChange={handleChange} autoComplete="off" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input id="phoneNumber" name="phoneNumber" value={values.phoneNumber} onChange={handleChange} autoComplete="off" />
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
                          value={values.password}
                          onChange={handleChange}
                          autoComplete="off"
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
                    <StepHeader title="Your role" />
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input id="jobTitle" name="jobTitle" value={values.jobTitle} onChange={handleChange} autoComplete="off" />
                    </div>
                  </div>
                )}
                {step === 4 && (
                  <div className="space-y-4">
                    <StepHeader title="Company basics" />
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input id="companyName" name="companyName" value={values.companyName} onChange={handleChange} autoComplete="off" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="companySize">Company Size</Label>
                        <Select value={values.companySize} onValueChange={(value) => handleSelectChange("companySize", value)}>
                          <SelectTrigger id="companySize" className="w-full">
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-50">0 - 50</SelectItem>
                            <SelectItem value="50-100">50 - 100</SelectItem>
                            <SelectItem value="100-500">100 - 500</SelectItem>
                            <SelectItem value="500-1000">500 - 1000</SelectItem>
                            <SelectItem value=">1000">&gt; 1000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select value={values.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
                          <SelectTrigger id="industry" className="w-full">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Financial Services">Financial Services</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="Retail">Retail</SelectItem>
                            <SelectItem value="Government">Government</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
                {step === 5 && (
                  <div className="space-y-4">
                    <StepHeader title="Company contact details" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="companyPhoneNumber">Company Phone Number</Label>
                        <Input id="companyPhoneNumber" name="companyPhoneNumber" value={values.companyPhoneNumber} onChange={handleChange} autoComplete="off" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyEmail">Company Email</Label>
                        <Input id="companyEmail" name="companyEmail" type="email" value={values.companyEmail} onChange={handleChange} autoComplete="off" />
                      </div>
                    </div>
                  </div>
                )}
                {step === 6 && (
                  <div className="space-y-4">
                    <StepHeader title="Where are you located?" subtitle="City is optional." />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="companyCountry">Company Country</Label>
                        <Select value={values.companyCountry} onValueChange={(value) => handleSelectChange("companyCountry", value)}>
                          <SelectTrigger id="companyCountry" className="w-full">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Zambia">Zambia</SelectItem>
                            <SelectItem value="South Africa">South Africa</SelectItem>
                            <SelectItem value="Kenya">Kenya</SelectItem>
                            <SelectItem value="Nigeria">Nigeria</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            <SelectItem value="United States">United States</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyCity">Company City</Label>
                        <Select value={values.companyCity} onValueChange={(value) => handleSelectChange("companyCity", value)}>
                          <SelectTrigger id="companyCity" className="w-full">
                            <SelectValue placeholder="Select city (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Lusaka">Lusaka</SelectItem>
                            <SelectItem value="Ndola">Ndola</SelectItem>
                            <SelectItem value="Kitwe">Kitwe</SelectItem>
                            <SelectItem value="Johannesburg">Johannesburg</SelectItem>
                            <SelectItem value="Nairobi">Nairobi</SelectItem>
                            <SelectItem value="Lagos">Lagos</SelectItem>
                            <SelectItem value="London">London</SelectItem>
                            <SelectItem value="New York">New York</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="text-sm grid gap-2">
                      <div><span className="text-muted-foreground">Name:</span> {values.firstName} {values.lastName}</div>
                      <div><span className="text-muted-foreground">Email:</span> {values.email}</div>
                      <div><span className="text-muted-foreground">Phone:</span> {values.phoneNumber || "—"}</div>
                      <div><span className="text-muted-foreground">Job Title:</span> {values.jobTitle || "—"}</div>
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

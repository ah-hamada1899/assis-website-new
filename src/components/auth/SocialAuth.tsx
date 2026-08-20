import { oauthUrl } from '../../lib/api'
import { GoogleIcon, MicrosoftIcon } from '../brand'
import { Button } from '../ui/Button'
import { Divider } from '../ui/Separator'

export function SocialAuth({ intent }: { intent: 'sign in' | 'sign up' }) {
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="neutral"
        onClick={() => {
          window.location.assign(oauthUrl('google'))
        }}
      >
        <GoogleIcon />
        Continue with Google
      </Button>
      <Button
        variant="neutral"
        onClick={() => {
          window.location.assign(oauthUrl('microsoft'))
        }}
      >
        <MicrosoftIcon />
        Continue with Microsoft
      </Button>
      <p className="pt-1 text-center text-[12px] font-medium leading-4 text-outline">
        You can also {intent} with email or phone if a provider is unavailable.
      </p>
    </div>
  )
}

export { Divider }

import { useState } from "react"

interface GoogleReferralModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (referralCode: string | null) => void
  userEmail: string
}

export function GoogleReferralModal({
  isOpen,
  onClose,
  onSubmit,
  userEmail,
}: GoogleReferralModalProps) {
  const [referralCode, setReferralCode] = useState("")
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (referralCode.trim() === "") {
      onSubmit(null)
      return
    }
    onSubmit(referralCode.trim())
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Almost there!</h2>
        <p className="text-gray-600 mb-4">Do you have a referral code? (Optional)</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="Enter referral code"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => onSubmit(null)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Skip
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

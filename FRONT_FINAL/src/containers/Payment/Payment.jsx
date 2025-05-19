"use client"

import { useState } from "react"
import axios from "../../helpers/axios"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"


const Plans = () => {
  const user = useSelector((state) => state.login)
  const { subscription } = useSelector((state) => state.payment)

  const [currentSubscription, setCurrentSubscription] = useState(subscription || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { t } = useTranslation()

  // Check if subscription is still active
  const isSubscriptionActive = currentSubscription && new Date(currentSubscription.expDate) > new Date()

  const plan = {
    _id: { $oid: "6807504a86e0dee81305b5be" },
    paymentId: "price_1RLkZCQ2etjb7mmH23JUnSw8",
    link: "https://buy.stripe.com/test_cN2dTn4Qm9hf836000",
    name: "Premium",
    duration: "year",
    price: 99,
    description: t("Yearly Premium Membership"),
    benefits: [
      "Résultats d'IA Instantanément",
      "Accès à la Liste Complète des Docteurs",
      "Support Prioritaire",
    ],
    discount: 0,
  }

  const handleSubscription = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (currentSubscription) {
        const confirmCancel = window.confirm(
          "You have an existing subscription. Choosing a new plan will cancel the current one. Continue?",
        )
        if (!confirmCancel) {
          setIsLoading(false)
          return
        }

        await axios.post("/payments/cancel", {
          subscriptionId: currentSubscription.subID,
        })
      }

      const response = await axios.post("/payment/create", {
        patientId: user?.id,
        paymentMethodId: "pm_card_visa",
        priceId: plan.paymentId,
      })

      setCurrentSubscription({
        subID: response.data.subscriptionId,
        expDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      })

      window.location.href = plan.link
    } catch (err) {
      console.error("Subscription error:", err)
      setError("Failed to process subscription. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to format date in a more readable way
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Calculate days remaining in subscription
  const getDaysRemaining = (expDate) => {
    const today = new Date()
    const expiration = new Date(expDate)
    const diffTime = expiration - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="container mx-auto max-w-4xl bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="p-6 w-full relative mx-auto pt-[100px] min-h-[100dvh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="text-3xl font-bold text-purple-700 relative">
              {t("Premium Subscription")}
              <span className="absolute w-[40%] h-1 bg-pink-500 rounded-md bottom-[-8px] left-0"></span>
            </h2>
          </div>
        </div>

        <div className="border-b border-pink-200 mb-6"></div>

        {isSubscriptionActive ? (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg mb-6 shadow-md border border-pink-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-pink-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-pink-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-800">You're already a Premium member!</h3>
                  <p className="text-purple-600">
                    Your subscription is active until{" "}
                    <span className="font-medium">{formatDate(currentSubscription.expDate)}</span> (
                    {getDaysRemaining(currentSubscription.expDate)} days remaining)
                  </p>
                </div>
              </div>
              <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-pink-200">
                <span className="text-pink-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Active
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-pink-200">
              <p className="text-purple-700">
                You're enjoying all premium benefits! You'll be notified before your subscription expires.
              </p>
            </div>
          </div>
        ) : currentSubscription ? (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg mb-6 shadow-sm border border-pink-200">
            <div className="flex items-center">
              <span className="text-purple-600 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <p className="font-medium text-purple-700">
                Your subscription has expired on{" "}
                <span className="font-semibold">{formatDate(currentSubscription.expDate)}</span>. Please renew to
                continue enjoying premium benefits.
              </p>
            </div>
          </div>
        ) : null}

        <div className="bg-white rounded-lg shadow-md overflow-hidden backdrop-blur-sm bg-opacity-80 border border-pink-100">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-.181h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-800">{plan.name}</h3>
                  <p className="text-purple-600">{plan.description}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-3xl font-bold text-pink-600">${plan.price}</div>
                <div className="text-sm text-purple-500">{t("per year")}</div>
              </div>
            </div>

            <div className="mt-6 border-t border-pink-100 pt-6">
              <h4 className="text-lg font-semibold mb-4 text-purple-700">Features and Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                {plan.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <span className="flex-shrink-0 h-5 w-5 bg-pink-100 rounded-full flex items-center justify-center mr-2">
                      <svg className="h-3 w-3 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span className="text-purple-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              {isSubscriptionActive ? (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-200 text-center">
                  <p className="text-purple-700 font-medium">You already have an active subscription</p>
                </div>
              ) : (
                <button
                  onClick={handleSubscription}
                  disabled={isLoading}
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-700 transition transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                      {currentSubscription ? t("Renew Subscription") : t("Subscribe Now")}
                    </>
                  )}
                </button>
              )}
              {error && <div className="mt-3 text-red-500 text-sm">{error}</div>}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-purple-100 rounded-full p-2 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-lg text-purple-800 mb-1">Pourquoi Passer au Premium?</h4>
              <p className="text-purple-700">
                Les membres Premium reçoivent instantanément les résultats d'IA et ont accès à notre liste complète de
                docteurs spécialisés. Alors que les patients standards reçoivent leurs résultats en 24-48 heures, les
                patients Premium les obtiennent immédiatement, avec un support prioritaire et des réductions exclusives
                sur tous les cours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Plans

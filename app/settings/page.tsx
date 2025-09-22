import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Settings = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  return (
    <main className="min-lg:w-3/4">
      <section className="flex justify-between gap-4 max-sm:flex-col items-center mb-8">
        <div className="flex gap-4 items-center">
          <Image
            src={user.imageUrl}
            alt={user.firstName!}
            width={80}
            height={80}
            className="rounded-lg"
          />
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-3xl">Settings</h1>
            <p className="text-sm text-gray-600">
              Manage your account preferences and settings
            </p>
          </div>
        </div>
      </section>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="account" className="border rounded-lg p-4">
          <AccordionTrigger className="text-xl font-semibold">
            Account Information
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {user.firstName} {user.lastName}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {user.emailAddresses[0].emailAddress}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Since
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Status
                </label>
                <div className="p-3 bg-green-50 text-green-800 rounded-lg">
                  Active
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Manage Account</h3>
              <p className="text-sm text-blue-700 mb-3">
                To update your account information, please visit your Clerk user profile.
              </p>
              <a
                href="/user-profile"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="preferences" className="border rounded-lg p-4">
          <AccordionTrigger className="text-xl font-semibold">
            Learning Preferences
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Session Duration
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="15">15 minutes</option>
                  <option value="30" selected>30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Voice Style
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="formal">Formal</option>
                  <option value="casual" selected>Casual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favorite Subjects
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["maths", "science", "history", "coding", "language", "economics"].map((subject) => (
                    <label key={subject} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="text-sm capitalize">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Save Preferences
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="notifications" className="border rounded-lg p-4">
          <AccordionTrigger className="text-xl font-semibold">
            Notifications
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Session Reminders</h3>
                  <p className="text-sm text-gray-600">Get notified about upcoming sessions</p>
                </div>
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  defaultChecked
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">New Companion Alerts</h3>
                  <p className="text-sm text-gray-600">Be the first to know about new companions</p>
                </div>
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Weekly Progress Reports</h3>
                  <p className="text-sm text-gray-600">Receive weekly learning progress summaries</p>
                </div>
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  defaultChecked
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="privacy" className="border rounded-lg p-4">
          <AccordionTrigger className="text-xl font-semibold">
            Privacy & Data
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Session Data</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Your voice sessions are processed to provide transcriptions and improve the learning experience.
                </p>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  Download My Data
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Account Deletion</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Permanently delete your account and all associated data.
                </p>
                <button className="text-red-600 hover:text-red-800 text-sm">
                  Delete Account
                </button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default Settings;
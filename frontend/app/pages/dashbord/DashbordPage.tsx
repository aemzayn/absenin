import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Calendar, Users, Building, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "~/contexts/auth-contexts";
import { useInstitution } from "~/contexts/institution-context";

export const DashboardPage = () => {
  const { currentInstitution } = useInstitution();
  const { user } = useAuth();

  if (!currentInstitution) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Building className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Institution Selected
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please select an institution to view the dashboard.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Orphans",
      value: currentInstitution.currentOrphans.toString(),
      icon: Users,
      description: "Active children in care",
    },
    {
      title: "Capacity",
      value: `${Math.round(
        (currentInstitution.currentOrphans / currentInstitution.capacity) * 100
      )}%`,
      icon: Building,
      description: `${currentInstitution.currentOrphans}/${currentInstitution.capacity} occupied`,
    },
    {
      title: "Upcoming Events",
      value: "3",
      icon: Calendar,
      description: "Events this month",
    },
    {
      title: "Monthly Growth",
      value: "+12%",
      icon: TrendingUp,
      description: "New admissions this month",
    },
  ];

  // Age distribution data
  const ageDistributionData = [
    { ageRange: "0-5", male: 12, female: 15 },
    { ageRange: "6-10", male: 25, female: 22 },
    { ageRange: "11-15", male: 18, female: 20 },
    { ageRange: "16-18", male: 8, female: 12 },
  ];

  // Gender distribution data
  const genderData = [
    { name: "Male", value: 63, color: "#3B82F6" },
    { name: "Female", value: 69, color: "#EC4899" },
  ];

  const recentEvents = [
    {
      name: "Winter Clothing Distribution",
      date: "2024-01-15",
      status: "upcoming",
      participants: 45,
    },
    {
      name: "Educational Supplies",
      date: "2024-01-10",
      status: "completed",
      participants: 78,
    },
    {
      name: "Food Package Distribution",
      date: "2024-01-05",
      status: "completed",
      participants: currentInstitution.currentOrphans,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {currentInstitution.name} - {currentInstitution.description}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-blue-100">
            Your Role: {currentInstitution.role}
          </Badge>
          <Badge variant="outline">
            Est. {currentInstitution.establishedDate}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-gray-200 dark:border-gray-700"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Distribution Chart */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Age Distribution by Gender
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageRange" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="male" fill="#3B82F6" name="Male" />
                <Bar dataKey="female" fill="#EC4899" name="Female" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gender Distribution Pie Chart */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Gender Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${((percent ?? 1) * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Institution Info */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Institution Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Contact Details
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-600 dark:text-gray-400">
                    Address:
                  </span>{" "}
                  {currentInstitution.address}
                </p>
                <p>
                  <span className="text-gray-600 dark:text-gray-400">
                    Phone:
                  </span>{" "}
                  {currentInstitution.phone}
                </p>
                <p>
                  <span className="text-gray-600 dark:text-gray-400">
                    Email:
                  </span>{" "}
                  {currentInstitution.email}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Capacity Overview
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Current Occupancy
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {currentInstitution.currentOrphans}/
                    {currentInstitution.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (currentInstitution.currentOrphans /
                          currentInstitution.capacity) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Recent Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {event.participants} participants
                  </span>
                  <Badge
                    variant={
                      event.status === "completed" ? "default" : "secondary"
                    }
                    className={
                      event.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-100"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-blue-100"
                    }
                  >
                    {event.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

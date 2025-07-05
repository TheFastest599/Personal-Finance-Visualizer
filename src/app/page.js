'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import {
  ChartBar,
  DollarSign,
  Target,
  TrendingUp,
  BarChart3,
  CreditCard,
  PieChart,
  ArrowRight,
} from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const quickActions = [
    {
      title: 'Dashboard',
      description: 'Get an overview of your financial health',
      icon: BarChart3,
      route: '/dashboard',
      color: 'text-blue-600',
      bgColor: '',
    },
    {
      title: 'Transactions',
      description: 'Add, edit, and manage your transactions',
      icon: CreditCard,
      route: '/transactions',
      color: 'text-green-600',
      bgColor: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Budgets',
      description: 'Create and track your spending budgets',
      icon: Target,
      route: '/budgets',
      color: 'text-purple-600',
      bgColor: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Analytics',
      description: 'Dive deep into your spending analytics',
      icon: PieChart,
      route: '/analytics',
      color: 'text-orange-600',
      bgColor: 'bg-orange-600 hover:bg-orange-700',
    },
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Personal Finance
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Visualizer
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Take control of your finances with beautiful charts, smart
              budgeting, and insightful analytics. Your journey to financial
              freedom starts here.
            </p>
          </div>

          {/* Quick Actions Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
              Get Started Now
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Card
                    key={index}
                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md hover:scale-105"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <IconComponent className={`w-8 h-8 ${action.color}`} />
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                      <CardTitle className="text-lg font-semibold">
                        {action.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {action.description}
                      </p>
                      <Button
                        onClick={() => router.push(action.route)}
                        className={`w-full ${action.bgColor} text-white border-0`}
                      >
                        Open {action.title}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Finances?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who have taken control of their financial
              future
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                View Dashboard
              </Button>
              <Button
                onClick={() => router.push('/transactions')}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold"
              >
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  100%
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Free to Use
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  Real-time
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Data Updates
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  Secure
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Data Storage
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  Smart
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Analytics
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

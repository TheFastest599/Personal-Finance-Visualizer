'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Shield,
  Zap,
  Users,
  CheckCircle,
  Star,
  TrendingDown,
  Calendar,
  Activity,
} from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: BarChart3,
      title: 'Smart Dashboard',
      description:
        'Comprehensive overview of your financial health with real-time insights',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      icon: CreditCard,
      title: 'Transaction Management',
      description: 'Track income and expenses with intelligent categorization',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      icon: Target,
      title: 'Budget Planning',
      description: 'Set and monitor budgets with progress tracking and alerts',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      icon: PieChart,
      title: 'Visual Analytics',
      description:
        'Interactive charts and graphs for better financial understanding',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and stored securely',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with modern tech stack for optimal performance',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    },
  ];

  const quickActions = [
    {
      title: 'Dashboard',
      description: 'Financial overview',
      icon: BarChart3,
      route: '/dashboard',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Transactions',
      description: 'Manage money flow',
      icon: CreditCard,
      route: '/transactions',
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Budgets',
      description: 'Plan your spending',
      icon: Target,
      route: '/budgets',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Analytics',
      description: 'Deep insights',
      icon: PieChart,
      route: '/analytics',
      gradient: 'from-orange-500 to-orange-600',
    },
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: Activity, value: '99.9%', label: 'Uptime' },
    { icon: TrendingUp, value: '50M+', label: 'Transactions' },
    { icon: Shield, value: '100%', label: 'Secure' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Financial Analyst',
      content:
        'This app transformed how I manage my personal finances. The visualizations are incredible!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Small Business Owner',
      content:
        'Clean interface and powerful features. Perfect for tracking both personal and business expenses.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Manager',
      content:
        'The budget tracking feature helped me save 30% more each month. Highly recommended!',
      rating: 5,
    },
  ];

  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/25 bg-[size:50px_50px] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              ✨ Transform Your Financial Life
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Master Your Money with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                Smart Analytics
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              Professional-grade financial tracking with beautiful
              visualizations, intelligent budgeting, and actionable insights to
              accelerate your wealth building.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/analytics')}
                className="px-8 py-4 text-lg font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                View Demo
              </Button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-slate-200 dark:border-slate-700">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Powerful Features for Smart Money Management
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Everything you need to take control of your finances and build
              lasting wealth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Start Your Financial Journey
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Choose your starting point and begin building better financial
              habits
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md hover:scale-105 overflow-hidden"
                onClick={() => router.push(action.route)}
              >
                <div className={`h-2 bg-gradient-to-r ${action.gradient}`} />
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <action.icon className="w-8 h-8 text-slate-700 dark:text-slate-300" />
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                    {action.description}
                  </p>
                  <Button
                    className={`w-full bg-gradient-to-r ${action.gradient} text-white border-0 hover:opacity-90`}
                  >
                    Open {action.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              See what our users are saying about their financial transformation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Financial Future?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of users who have already taken control of their
              finances. Start your journey to financial freedom today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push('/dashboard')}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/transactions')}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
              >
                Add First Transaction
              </Button>
            </div>

            <p className="text-blue-100 text-sm mt-6">
              ✨ No credit card required • 100% free to start • Secure & private
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

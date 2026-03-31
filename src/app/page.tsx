'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Zap, CheckCircle, BarChart2, Users, ArrowRight,
  ChevronDown, ChevronUp, Star, Clock, Shield, TrendingUp,
  Play, Check
} from 'lucide-react';

const features = [
  {
    icon: CheckCircle,
    title: 'Task Management',
    description: 'Assign, track and manage tasks with ease. Set priorities, deadlines, and monitor progress in real-time.',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Keep everyone aligned and informed. Share updates, review timelines, and collaborate seamlessly across teams.',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: BarChart2,
    title: 'Analytics & Reports',
    description: 'Make smarter decisions with insights. Track team performance, project analytics, and resource allocation.',
    color: 'bg-green-50',
    iconColor: 'text-green-600',
  },
];

const stats = [
  { value: '40%', label: 'More done in less time', icon: TrendingUp },
  { value: '98%', label: 'Customer satisfaction rate', icon: Star },
  { value: '2min', label: 'Average setup time', icon: Clock },
  { value: '256-bit', label: 'Enterprise-grade security', icon: Shield },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for individuals and small teams',
    buttonLabel: 'Start Free Trial',
    buttonStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    features: ['Up to 5 team members', 'Basic task management', 'Calendar view', 'Mobile app', '1 GB storage'],
    popular: false,
  },
  {
    name: 'Professional',
    price: '$12',
    period: '/month',
    description: 'For growing teams that need more power',
    buttonLabel: 'Get Started',
    buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
    features: ['Unlimited team members', 'Advanced task management', 'Calendar & timeline views', 'Mobile app', '100 GB storage', 'Advanced analytics', 'Time tracking'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with specific needs',
    buttonLabel: 'Contact Sales',
    buttonStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    features: ['Everything in Professional', 'Unlimited storage', 'Advanced security & SSO', 'Custom integrations', 'Dedicated account manager', 'Priority support', 'SLA guarantee', 'Custom training'],
    popular: false,
  },
];

const faqs = [
  { q: 'Can I change my plan later?', a: 'Yes, you can change your plan at any time. Upgrade or downgrade based on your needs, and your billing adjusts automatically so you always pay efficiently for what you actually need.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise plans. All transactions are secured with 256-bit encryption.' },
  { q: 'Is there a long-term contract?', a: 'No, there are no long-term contracts. TaskFlow is billed monthly or annually, and you can cancel at any time without any penalties or fees.' },
  { q: 'Do you offer discounts for annual billing?', a: 'Yes! Switching to annual billing saves you 20% compared to monthly billing. The discount is automatically applied when you select the annual payment option.' },
  { q: 'What happens after my free trial ends?', a: "After your 14-day free trial, you'll be prompted to choose a plan. If you don't upgrade, your account will switch to the Free plan, and you'll retain access to your data." },
  { q: 'Can I upgrade or downgrade my plan at any time?', a: 'Absolutely! You can upgrade instantly to access new features immediately. Downgrades take effect at the end of your current billing cycle so you keep your benefits.' },
];

const trustedBy = ['Shopify', 'Airbnb', 'Slack', 'Canva', 'Calendly', 'Gusto'];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">TaskFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Features', 'About Us', 'Pricing', 'Blogs'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
                className={`text-sm font-medium transition-colors ${item === 'Home' ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}>
                {item}
              </a>
            ))}
          </div>

          <Link href="/dashboard" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            <Zap size={14} />
            Trusted by 10,000+ teams worldwide
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Manage Work Smarter and{' '}
            <span className="italic font-serif">Keep Your{' '}</span>
            <span className="text-blue-600 italic font-serif">Team Aligned</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            TaskFlow helps modern teams stay aligned, meet deadlines faster, and turn complex workflows into simple, actionable steps.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/dashboard" className="flex items-center gap-2 bg-blue-600 text-white px-7 py-3.5 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              Start Free Trial
              <ArrowRight size={16} />
            </Link>
            <button className="flex items-center gap-2 border border-gray-200 text-gray-700 px-7 py-3.5 rounded-2xl text-sm font-semibold hover:bg-gray-50 transition-colors">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <Play size={10} className="text-white ml-0.5" />
              </div>
              Contact Sales
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-gray-400 flex-wrap">
            {['No credit card required', 'Free 14-day trial', 'Cancel anytime'].map((text) => (
              <div key={text} className="flex items-center gap-1.5">
                <Check size={14} className="text-green-500" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-10 border-y border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Trusted by</p>
          <div className="flex items-center justify-center gap-10 flex-wrap">
            {trustedBy.map((company) => (
              <span key={company} className="text-gray-400 font-semibold text-base hover:text-gray-600 transition-colors cursor-default">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-blue-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm mb-3">Powerful Features</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Team in{' '}
              <span className="italic font-serif">One Powerful Platform</span>
            </h2>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="flex-1 mx-4 bg-gray-700 rounded-md py-1 px-3 text-xs text-gray-400">app.taskflow.com/dashboard</div>
            </div>
            <div className="grid grid-cols-4">
              {/* Sidebar preview */}
              <div className="border-r border-gray-100 p-4 bg-white">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center"><Zap size={12} className="text-white" /></div>
                  <span className="font-bold text-sm text-gray-900">TaskFlow</span>
                </div>
                {['Dashboard', 'Tasks', 'Projects', 'Analytics', 'Calendar', 'Team Members'].map((item, i) => (
                  <div key={item} className={`flex items-center gap-2 py-2 px-2 rounded-lg mb-0.5 ${i === 0 ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    <span className="text-xs font-medium">{item}</span>
                  </div>
                ))}
              </div>
              {/* Main content preview */}
              <div className="col-span-3 p-5 bg-gray-50">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[['156', 'Active Projects'], ['82%', 'Utilization Rate'], ['2.4 Days', 'Average Time'], ['3', 'At Risk Projects']].map(([v, l]) => (
                    <div key={l} className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-lg font-bold text-gray-900">{v}</p>
                      <p className="text-xs text-gray-400">{l}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-3 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-700 mb-3">Task Status Distribution</p>
                    <div className="space-y-2">
                      {[['In Progress', '67%', 'bg-blue-500'], ['Completed', '24%', 'bg-green-500'], ['Overdue', '9%', 'bg-amber-400']].map(([l, v, c]) => (
                        <div key={l}>
                          <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{l}</span><span className="font-semibold">{v}</span></div>
                          <div className="h-1.5 bg-gray-100 rounded-full"><div className={`h-full rounded-full ${c}`} style={{ width: v }}></div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-700 mb-3">Team Workload</p>
                    <div className="space-y-2">
                      {[['Mark Chen', 'On Track', 'text-green-600 bg-green-50'], ['Emily Davis', 'Under Pressure', 'text-amber-600 bg-amber-50'], ['John Smith', 'Sustained', 'text-blue-600 bg-blue-50'], ['Linda Johnson', 'Overloaded', 'text-red-600 bg-red-50']].map(([name, status, style]) => (
                        <div key={name} className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">{name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style}`}>{status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm mb-3">Why Choose Us</p>
            <h2 className="text-3xl font-bold text-gray-900">
              Why teams choose <span className="italic font-serif">TaskFlow</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white border border-gray-100 rounded-3xl p-7 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300">
                  <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-5`}>
                    <Icon size={22} className={f.iconColor} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
                  <Icon size={22} className="text-blue-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm mb-3">Pricing</p>
            <h2 className="text-3xl font-bold text-gray-900">
              Simple, Transparent <span className="italic font-serif">Pricing</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`bg-white rounded-3xl p-7 border transition-all duration-300 hover:shadow-xl relative ${
                plan.popular ? 'border-blue-500 shadow-xl shadow-blue-100' : 'border-gray-100 hover:border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">Most Popular</span>
                  </div>
                )}
                <p className="font-bold text-gray-900 text-lg mb-1">{plan.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-400 text-sm mb-1">{plan.period}</span>}
                </div>
                <p className="text-sm text-gray-400 mb-6">{plan.description}</p>
                <button className={`w-full py-3 rounded-2xl text-sm font-bold mb-6 transition-colors ${plan.buttonStyle}`}>
                  {plan.buttonLabel}
                </button>
                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <Check size={15} className="text-green-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm mb-3">FAQ</p>
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked <span className="italic font-serif">Questions</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden bg-white hover:border-gray-200 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp size={18} className="text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
                    <div className="pt-4">{faq.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-blue-100 mb-8 text-sm">Join over 10,000 teams already using TaskFlow to manage their work smarter.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/dashboard" className="bg-white text-blue-600 px-7 py-3.5 rounded-2xl text-sm font-bold hover:bg-blue-50 transition-colors">
              Start Free Trial
            </Link>
            <button className="border border-white/30 text-white px-7 py-3.5 rounded-2xl text-sm font-semibold hover:bg-white/10 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center"><Zap size={14} className="text-white" /></div>
            <span className="font-bold text-gray-900">TaskFlow</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 TaskFlow. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Support'].map((item) => (
              <a key={item} href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

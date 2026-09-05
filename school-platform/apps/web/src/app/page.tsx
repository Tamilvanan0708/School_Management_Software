'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* ── Public Navigation Bar ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-linear-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-blue-600/30">
              🎓
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg tracking-tight block">
                Demo International School
              </span>
              <span className="text-xs text-slate-500 block -mt-0.5">
                Excellence · Integrity · Innovation
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-blue-600 transition-colors">About Us</a>
            <a href="#academics" className="hover:text-blue-600 transition-colors">Academics</a>
            <a href="#facilities" className="hover:text-blue-600 transition-colors">Campus Life</a>
            <a href="#notices" className="hover:text-blue-600 transition-colors">Notice Board</a>
            <a href="#mobile-app" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <span>📱</span>
              <span>Parent & Student App</span>
            </a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#mobile-app"
              className="hidden sm:flex px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all items-center gap-1.5"
            >
              <span>📱</span>
              <span>Parent App</span>
            </a>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/25 transition-all flex items-center gap-2"
            >
              <span>Staff Portal</span>
              <span>➔</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-linear-to-b from-white via-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-6">
              <span>🌟</span> Admissions Open for 2026–2027
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15] mb-6">
              Nurturing Tomorrow’s Leaders with <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Excellence</span> & <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">Values</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Welcome to Demo International School. We provide a holistic educational environment integrating world-class academics, modern STEM labs, sports, and transparent parent-school collaboration.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Staff & Teacher Portal</span>
                <span>➔</span>
              </Link>
              <a
                href="#mobile-app"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-base border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>📱</span>
                <span>Download Parent App</span>
              </a>
            </div>
          </div>
        </div>

        {/* Decorative background blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-400/10 blur-[100px] pointer-events-none rounded-full" />
      </section>

      {/* ── Key Statistics Ribbon ── */}
      <section className="bg-slate-900 text-white py-12 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-tight">1,200+</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Students Enrolled</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 tracking-tight">98.8%</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Board Exam Distinction</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">65+</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Certified Educators</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">15:1</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Student-Teacher Ratio</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Us & Educational Philosophy ── */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
                Our Educational Philosophy
              </div>
              <h2 className="text-3xl font-bold text-slate-950 tracking-tight mb-5">
                Every child has an innate potential waiting to be discovered
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                At Demo International School, education extends beyond textbook memorization. We inspire students to think critically, experiment fearlessly, and develop character that stands strong through life&apos;s challenges.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Our campus pairs rigorous curriculum standards with personalized mentoring, sports programs, fine arts, and cutting-edge digital infrastructure.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="font-bold text-slate-900 text-sm">Outcome Focused</div>
                  <div className="text-xs text-slate-500 mt-0.5">Continuous evaluation & transparent feedback</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-2xl mb-1">🤝</div>
                  <div className="font-bold text-slate-900 text-sm">Connected Parents</div>
                  <div className="text-xs text-slate-500 mt-0.5">Real-time attendance & fee management app</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                  <div className="text-4xl mb-2">🔬</div>
                  <div className="font-bold text-slate-900">Modern Labs</div>
                  <div className="text-xs text-slate-600 mt-1">Physics, Chemistry, Biology & Robotics</div>
                </div>
                <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                  <div className="text-4xl mb-2">⚽</div>
                  <div className="font-bold text-slate-900">Athletic Arena</div>
                  <div className="text-xs text-slate-600 mt-1">Football, Cricket, Basketball & Swimming</div>
                </div>
              </div>
              <div className="space-y-4 pt-6">
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                  <div className="text-4xl mb-2">📖</div>
                  <div className="font-bold text-slate-900">Digital Library</div>
                  <div className="text-xs text-slate-600 mt-1">10,000+ Titles, Journals & E-learning</div>
                </div>
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                  <div className="text-4xl mb-2">🎨</div>
                  <div className="font-bold text-slate-900">Fine Arts Studio</div>
                  <div className="text-xs text-slate-600 mt-1">Music, Classical Dance & Theatre</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Academic Programs Wings ── */}
      <section id="academics" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Structured for Every Milestone
            </div>
            <h2 className="text-3xl font-bold text-slate-950 tracking-tight">Academic Wings</h2>
            <p className="text-slate-600 mt-2 text-sm">
              Tailored pedagogical stages meeting the emotional and cognitive growth of students at every grade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold mb-5">
                🌱
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Kindergarten to Grade 5</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Primary Wing</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Foundational numeracy, linguistic fluency, hands-on science activities, and social-emotional development through experiential play and storytelling.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 border-t border-slate-100 pt-4">
                <li>✓ Activity-based curriculum</li>
                <li>✓ Phonics & multi-lingual basics</li>
                <li>✓ Interactive smartboard classes</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-bold mb-5">
                🌿
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Grade 6 to Grade 8</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Middle School Wing</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Transitioning to inquiry-based learning in physical sciences, computational thinking, humanities, and active participation in competitive sports and debates.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 border-t border-slate-100 pt-4">
                <li>✓ Science laboratory experiments</li>
                <li>✓ Coding & computer literacy</li>
                <li>✓ Inter-school competitions</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-bold mb-5">
                🌳
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">Grade 9 to Grade 12</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Senior Secondary Wing</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Specialized streams (Science, Commerce, Humanities) with comprehensive board examination coaching, career counseling, and college preparation.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 border-t border-slate-100 pt-4">
                <li>✓ Regular mock test cycles & analytics</li>
                <li>✓ Career guidance workshops</li>
                <li>✓ Leadership & student council</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Notice Board & Announcements ── */}
      <section id="notices" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
                Live Campus Updates
              </div>
              <h2 className="text-3xl font-bold text-slate-950 tracking-tight">Notice Board</h2>
            </div>
            <Link
              href="/login"
              className="mt-4 md:mt-0 text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
            >
              <span>View all circulars in portal</span>
              <span>➔</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[11px] font-bold uppercase">
                  Important Notice
                </span>
                <span className="text-xs text-slate-500">Sept 10, 2026</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">
                Mid-Term Examination Schedules Released
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                Timetable and syllabus weightage for Class 1 to 10 Mid-Term exams are now published on the portal. Parents are requested to review.
              </p>
              <Link href="/login" className="text-xs font-semibold text-amber-800 hover:underline">
                View Timetable →
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-200 text-blue-900 text-[11px] font-bold uppercase">
                  Event Circular
                </span>
                <span className="text-xs text-slate-500">Sept 15, 2026</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">
                Annual Science & Robotics Exhibition
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                Students from Grade 5 and above will present interactive science projects and automated robotic models. Parents are warmly invited.
              </p>
              <Link href="/login" className="text-xs font-semibold text-blue-800 hover:underline">
                Event Schedule →
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-200 text-emerald-900 text-[11px] font-bold uppercase">
                  Fee Reminder
                </span>
                <span className="text-xs text-slate-500">Sept 20, 2026</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">
                Term 2 Tuition Fee Due Date
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                Parents can pay tuition and transport fees securely through the portal via UPI, net banking, or debit card with instant PDF receipts.
              </p>
              <Link href="/login" className="text-xs font-semibold text-emerald-800 hover:underline">
                Pay Online →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile App Section for Parents & Students ── */}
      <section id="mobile-app" className="py-24 bg-linear-to-br from-indigo-950 via-slate-900 to-slate-950 text-white relative overflow-hidden border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <span>📱</span> Official School Mobile App
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-5">
                School in Your Pocket: Built Specially for <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">Parents & Students</span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                No need to sit at a computer or browse complex menus. Our dedicated mobile app gives parents 24/7 instant access to attendance, fee dues, homework, and teacher circulars with real-time push notifications.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl mb-2">🔔</div>
                  <h4 className="font-bold text-white text-sm">Instant Attendance Alerts</h4>
                  <p className="text-xs text-slate-400 mt-1">Get an instant notification the second your child is marked present or absent.</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl mb-2">💳</div>
                  <h4 className="font-bold text-white text-sm">1-Click UPI Fee Payments</h4>
                  <p className="text-xs text-slate-400 mt-1">Pay tuition & transport fees via Google Pay, PhonePe, or UPI with instant PDF receipt.</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl mb-2">📝</div>
                  <h4 className="font-bold text-white text-sm">Daily Homework & Notes</h4>
                  <p className="text-xs text-slate-400 mt-1">Review assigned homework, teacher notes, and submission deadlines without missing a beat.</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="font-bold text-white text-sm">Exam Results & Reports</h4>
                  <p className="text-xs text-slate-400 mt-1">Instant view of mid-term and annual exam marks, teacher remarks, and grade breakdowns.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <span>📥 Download Android APK</span>
                </a>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Available for Android & iOS</span>
                </div>
              </div>
            </div>

            {/* Mobile Mockup Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                      🎓
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Parent Companion</div>
                      <div className="text-[11px] text-emerald-400">● Live Synchronization</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase">
                    Mobile Only
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Today Attendance</span>
                      <span className="text-emerald-400 font-bold">✓ Present</span>
                    </div>
                    <div className="font-bold text-white text-sm">Aarav Verma (Class 5-A)</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Tuition Fee Due</span>
                      <span className="text-amber-400 font-bold">Due Sept 15</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-sm">₹5,000</div>
                      <button className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500">
                        Pay via UPI
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Recent Homework</div>
                    <div className="font-medium text-white text-xs">Mathematics: Fractions Exercise 4.2</div>
                    <div className="text-[11px] text-slate-400 mt-1">Submitted & Verified by Priya Sharma</div>
                  </div>
                </div>

                <div className="mt-5 p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-center">
                  <div className="text-xs text-blue-300 font-medium">Scan QR to install on phone</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Compatible with Android 8.0+ and iOS 14+</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full"></div>
      </section>

      {/* ── Contact & Location ── */}
      <section id="contact" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
                Connect With Us
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Demo International School Campus
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                We welcome prospective parents for guided campus visits every Saturday. Schedule an appointment or reach out to our administration desk.
              </p>
              <div className="space-y-3.5 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="text-blue-400 text-base">📍</span>
                  <span>123 Education Lane, Knowledge City, New Delhi 110001</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-400 text-base">📞</span>
                  <span>+91 98765 43210 / +91 98765 43211</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-400 text-base">✉️</span>
                  <span>admissions@demoschool.edu · info@demoschool.edu</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-400 text-base">⏰</span>
                  <span>Office Hours: Mon–Sat, 8:00 AM – 4:00 PM</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-800/90 border border-slate-700/80">
              <h3 className="text-lg font-bold text-white mb-2">Campus Visit & Inquiry</h3>
              <p className="text-xs text-slate-400 mb-5">
                Leave your details below and our admissions team will contact you within 24 hours.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for reaching out! Our team will contact you.'); }} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Parent Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91..."
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Seeking Grade</label>
                    <select className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-blue-500">
                      <option>Class 1 - 5</option>
                      <option>Class 6 - 8</option>
                      <option>Class 9 - 10</option>
                      <option>Class 11 - 12</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors mt-2"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 text-slate-500 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} Demo International School. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-slate-300 transition-colors">Staff Login</Link>
            <Link href="/login" className="hover:text-slate-300 transition-colors">Parent Portal</Link>
            <a href="#about" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
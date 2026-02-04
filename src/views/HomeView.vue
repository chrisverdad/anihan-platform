<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-12 sm:h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="flex items-center space-x-1 sm:space-x-2">
              <div class="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-violet-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm sm:text-lg">A</span>
              </div>
              <span class="text-lg sm:text-xl font-bold text-gray-900">AniHan</span>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="#features" class="text-gray-700 hover:text-violet-600 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200">
              Features
            </a>
            <a href="#about" class="text-gray-700 hover:text-emerald-600 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200">
              About
            </a>
            <a href="#contact" class="text-gray-700 hover:text-diamond-600 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200">
              Contact
            </a>
          </div>

          <!-- Auth Buttons -->
          <div class="flex items-center space-x-2 sm:space-x-4">
            <router-link to="/login" class="text-gray-700 hover:text-violet-600 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium">
              Sign In
            </router-link>
            <router-link to="/register" class="btn-primary bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2">
              Get Started
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-violet-600 via-emerald-600 to-diamond-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div class="text-center">
          <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            AniHan: A Digital Platform for Repurposing
            <span class="block text-emerald-200 mt-2">Agricultural Food Waste in Butuan City</span>
          </h1>
          <p class="text-sm sm:text-base lg:text-xl text-emerald-100 mb-6 sm:mb-8 max-w-4xl mx-auto px-4">
            A comprehensive digital system that enables vendors to manage and reduce food waste by converting surplus or damaged agricultural produce into valuable products such as compost fertilizers and sustainable food items.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <router-link to="/register" class="btn-secondary text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-2 sm:py-3 bg-emerald-600 hover:bg-emerald-700">
              Join Our Community
            </router-link>
            <a href="#features" class="btn-outline text-white border-white hover:bg-white hover:text-violet-600 text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-2 sm:py-3">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <section id="features" class="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">System Features & Capabilities</h2>
          <p class="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto px-4">
            AniHan implements real-time inventory tracking, data visualization tools, and ensures system usability through intuitive interfaces designed for users with varying levels of digital literacy.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <!-- For Vendors -->
          <div class="card text-center">
            <div class="card-body p-4 sm:p-6">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CubeIcon class="w-6 h-6 sm:w-8 sm:h-8 text-violet-600" />
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">For Vendors</h3>
              <ul class="text-left space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                <li class="flex items-start">
                  <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Image-based waste classification system</span>
                </li>
                <li class="flex items-start">
                  <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Real-time inventory and tracking module</span>
                </li>
                <li class="flex items-start">
                  <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Automated pickup scheduling</span>
                </li>
                <li class="flex items-start">
                  <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Processing status monitoring</span>
                </li>
                <li class="flex items-start">
                  <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Performance analytics and reports</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- For Consumers -->
          <div class="card text-center">
            <div class="card-body p-4 sm:p-6">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <ShoppingBagIcon class="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">For Consumers</h3>
              <ul class="text-left space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                <li class="flex items-start">
                  <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-diamond-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Browse comprehensive product catalog</span>
                </li>
                <li class="flex items-start">
                  <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-diamond-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Purchase organic compost & fertilizers</span>
                </li>
                <li class="flex items-start">
                  <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-diamond-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Order sustainable preserved food items</span>
                </li>
                <li class="flex items-start">
                  <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-diamond-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Track order status and delivery</span>
                </li>
                <li class="flex items-start">
                  <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-diamond-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Access affordable organic inputs</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- For Environment -->
          <div class="card text-center">
            <div class="card-body p-4 sm:p-6">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-diamond-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <SparklesIcon class="w-6 h-6 sm:w-8 sm:h-8 text-diamond-600" />
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">System Capabilities</h3>
              <ul class="text-left space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                <li class="flex items-start">
                  <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blood-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Data visualization tools (charts & graphs)</span>
                </li>
                <li class="flex items-start">
                  <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blood-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>System Usability Scale (SUS) evaluation</span>
                </li>
                <li class="flex items-start">
                  <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blood-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Real-time processing logs</span>
                </li>
                <li class="flex items-start">
                  <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blood-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Educational resources integration</span>
                </li>
                <li class="flex items-start">
                  <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blood-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Mobile-responsive design</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-12 sm:py-16 lg:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Our Impact in Numbers</h2>
          <p class="text-base sm:text-lg lg:text-xl text-gray-600">Making a difference in Butuan City's agricultural waste management</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div class="text-center">
            <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-violet-600 mb-1 sm:mb-2">1,247</div>
            <div class="text-xs sm:text-sm lg:text-base text-gray-600">Active Users</div>
          </div>
          <div class="text-center">
            <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600 mb-1 sm:mb-2">15,420</div>
            <div class="text-xs sm:text-sm lg:text-base text-gray-600">Kg Waste Processed</div>
          </div>
          <div class="text-center">
            <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-blood-600 mb-1 sm:mb-2">892</div>
            <div class="text-xs sm:text-sm lg:text-base text-gray-600">Orders Completed</div>
          </div>
          <div class="text-center">
            <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-diamond-600 mb-1 sm:mb-2">₱456K</div>
            <div class="text-xs sm:text-sm lg:text-base text-gray-600">Revenue Generated</div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">About AniHan</h2>
            <p class="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6">
              <strong>AniHan: A Digital Platform for Repurposing Agricultural Food Waste in Butuan City</strong> 
              is a capstone project developed by Christian Angelo Verdad and Wayne Krisha Cadenas, submitted 
              to the Department of Information Systems, College of Computing and Information Sciences (CCIS) 
              at Caraga State University - Main Campus.
            </p>
            <p class="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6">
              This comprehensive digital system addresses the critical issue of agricultural food waste in 
              Butuan City by creating a sustainable ecosystem that transforms surplus or damaged agricultural 
              produce into valuable products such as compost fertilizers and sustainable food items.
            </p>
            <p class="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6">
              The platform contributes to sustainability efforts and supports the United Nations' Zero Hunger 
              initiative by promoting efficient resource use and food security through real-time inventory 
              tracking, data visualization tools, and intuitive interfaces designed for users with varying 
              levels of digital literacy.
            </p>
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary-600 font-bold text-sm sm:text-base">CS</span>
                </div>
                <div class="ml-3">
                  <div class="font-medium text-gray-900 text-sm sm:text-base">Caraga State University</div>
                  <div class="text-xs sm:text-sm text-gray-500">Department of Information Systems, CCIS</div>
                  <div class="text-xs sm:text-sm text-gray-500">Developed by: Christian Angelo Verdad & Wayne Krisha Cadenas</div>
                </div>
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="aspect-w-16 aspect-h-9">
              <div class="bg-gradient-to-r from-primary-500 to-green-600 rounded-lg h-64 sm:h-80 lg:h-96 flex items-center justify-center">
                <div class="text-center text-white">
                  <SunIcon class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p class="text-base sm:text-lg lg:text-xl font-medium">Sustainable Agriculture</p>
                  <p class="text-green-200 text-sm sm:text-base">For a Better Tomorrow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-violet-600 to-emerald-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Join the Agricultural Waste Revolution</h2>
        <p class="text-base sm:text-lg lg:text-xl text-emerald-100 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
          Be part of a sustainable solution that transforms agricultural waste into valuable resources, 
          supports food security, and contributes to the United Nations' Zero Hunger initiative in Butuan City.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <router-link to="/register" class="btn-secondary text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-2 sm:py-3 bg-emerald-600 hover:bg-emerald-700">
            Get Started Today
          </router-link>
          <router-link to="/login" class="btn-outline text-white border-white hover:bg-white hover:text-violet-600 text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-2 sm:py-3">
            Sign In
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer id="contact" class="bg-gray-900 text-white py-8 sm:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div class="flex items-center space-x-1 sm:space-x-2 mb-3 sm:mb-4">
              <div class="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-violet-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm sm:text-lg">A</span>
              </div>
              <span class="text-lg sm:text-xl font-bold">AniHan</span>
            </div>
            <p class="text-gray-400 text-xs sm:text-sm">
              A Digital Platform for Repurposing Agricultural Food Waste in Butuan City - 
              Supporting sustainability and the UN Zero Hunger initiative.
            </p>
          </div>
          
          <div>
            <h3 class="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h3>
            <ul class="space-y-1 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
              <li><a href="#features" class="hover:text-white">Features</a></li>
              <li><a href="#about" class="hover:text-white">About</a></li>
              <li><router-link to="/login" class="hover:text-white">Sign In</router-link></li>
              <li><router-link to="/register" class="hover:text-white">Register</router-link></li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact</h3>
            <ul class="space-y-1 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
              <li>Caraga State University - Main Campus</li>
              <li>Department of Information Systems, CCIS</li>
              <li>Butuan City, Agusan del Norte</li>
              <li>Philippines</li>
              <li>Developers: Christian Angelo Verdad & Wayne Krisha Cadenas</li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Follow Us</h3>
            <div class="flex space-x-3 sm:space-x-4">
              <a href="#" class="text-gray-400 hover:text-white">
                <span class="sr-only">Facebook</span>
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white">
                <span class="sr-only">Twitter</span>
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2024 AniHan. All rights reserved. A capstone project by Christian Angelo Verdad & Wayne Krisha Cadenas, Caraga State University.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  CubeIcon,
  CheckIcon,
  ShoppingBagIcon,
  SparklesIcon,
  SunIcon
} from '@heroicons/vue/24/outline'
</script>

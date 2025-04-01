'use client';

import { useState } from 'react'
import { ProjectManager } from './ProjectManager'
import { SiteSettings } from './SiteSettings'
// Change from named imports to default imports
import AboutManager from './AboutManager'
import ContactManager from './ContactManager'
import ProfessionalJourneyManager from './ProfessionalJourneyManager'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('projects')

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('projects')}
              className={`${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              Site Settings
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`${
                activeTab === 'about'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('journey')}
              className={`${
                activeTab === 'journey'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              Professional Journey
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`${
                activeTab === 'contact'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              Contact
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'projects' && <ProjectManager />}
        {activeTab === 'settings' && <SiteSettings />}
        {activeTab === 'about' && <AboutManager />}
        {activeTab === 'journey' && <ProfessionalJourneyManager />}
        {activeTab === 'contact' && <ContactManager />}
      </div>
    </div>
  )
}
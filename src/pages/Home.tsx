import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Users, Building2, Truck, Leaf, GanttChart, HandHeart, Tractor } from 'lucide-react';
import { Link } from 'react-router-dom';
import GoalModal from '../components/GoalModal';

const GOALS_DATA = [
  {
    icon: Leaf,
    title: "Sustainable Agriculture",
    description: "Promote sustainable farming practices and environmental conservation",
    details: {
      overview: "Our sustainable agriculture initiative aims to transform farming practices across India by promoting environmentally conscious methods that ensure long-term food security while preserving natural resources for future generations. We focus on integrating traditional farming wisdom with modern sustainable technologies.",
      benefits: [
        "Reduced environmental impact through organic farming practices",
        "Improved soil health and biodiversity",
        "Lower water consumption through efficient irrigation",
        "Reduced dependency on chemical fertilizers",
        "Higher quality produce with better market value",
        "Long-term soil fertility and sustainability"
      ],
      initiatives: [
        {
          title: "Organic Farming Transition Program",
          description: "Supporting farmers in transitioning to organic farming through training, certification assistance, and market linkages."
        },
        {
          title: "Water Conservation Project",
          description: "Implementing drip irrigation and rainwater harvesting systems to optimize water usage in agriculture."
        },
        {
          title: "Soil Health Management",
          description: "Regular soil testing and promoting natural soil enhancement techniques through crop rotation and green manuring."
        }
      ],
      metrics: [
        "30% reduction in chemical fertilizer usage",
        "40% improvement in water use efficiency",
        "50% increase in organic farming adoption",
        "25% increase in soil organic matter content",
        "20% reduction in greenhouse gas emissions from farming practices"
      ]
    }
  },
  {
    icon: GanttChart,
    title: "Market Access",
    description: "Provide direct market access to farmers, eliminating intermediaries",
    details: {
      overview: "Our market access initiative revolutionizes how farmers connect with buyers by eliminating unnecessary intermediaries and creating direct market linkages. This digital transformation enables better price discovery and fair trade practices while ensuring quality produce reaches consumers efficiently.",
      benefits: [
        "Higher profit margins for farmers through direct sales",
        "Real-time market price information",
        "Reduced post-harvest losses",
        "Access to national and international markets",
        "Quality-based price premiums",
        "Transparent transaction processes"
      ],
      initiatives: [
        {
          title: "Digital Marketplace Platform",
          description: "A comprehensive online platform connecting farmers directly with institutional buyers, retailers, and consumers."
        },
        {
          title: "Quality Grading System",
          description: "Standardized quality assessment and grading system to ensure fair pricing based on produce quality."
        },
        {
          title: "Market Intelligence Service",
          description: "Real-time market information and price forecasting to help farmers make informed decisions."
        }
      ],
      metrics: [
        "40% increase in farmer income through direct market access",
        "60% reduction in post-harvest losses",
        "75% of transactions conducted digitally",
        "100,000+ active buyers on the platform",
        "30% improvement in price realization"
      ]
    }
  },
  {
    icon: HandHeart,
    title: "Farmer Welfare",
    description: "Ensure fair prices and better income for farming communities",
    details: {
      overview: "Our farmer welfare program takes a holistic approach to improving the lives of farming communities across India. We focus on financial security, social protection, and community development to ensure sustainable livelihoods and dignity for farmers.",
      benefits: [
        "Guaranteed minimum income support",
        "Access to affordable credit and insurance",
        "Social security benefits for farming families",
        "Skill development and capacity building",
        "Community infrastructure development",
        "Healthcare and education support"
      ],
      initiatives: [
        {
          title: "Financial Inclusion Program",
          description: "Facilitating access to formal banking, credit facilities, and insurance products tailored for farmers."
        },
        {
          title: "Skill Development Center",
          description: "Training programs for modern farming techniques, financial literacy, and alternative income generation."
        },
        {
          title: "Community Development Projects",
          description: "Infrastructure development, healthcare facilities, and educational support for farming communities."
        }
      ],
      metrics: [
        "100% farmers covered under insurance schemes",
        "50% increase in average household income",
        "75% reduction in distress sales",
        "90% farmers with access to formal credit",
        "1000+ villages with improved infrastructure"
      ]
    }
  }
];

const Home = () => {
  const [selectedGoal, setSelectedGoal] = useState<typeof GOALS_DATA[0] | null>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 px-4 py-16 bg-gradient-to-r from-green-50 to-emerald-50 w-full"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-4">
          Welcome to Kisan Sewak
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connecting farmers directly to the marketplace through government initiative
        </p>
      </motion.div>

      {/* User Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full px-4 mb-16">
        {[
          {
            icon: Sprout,
            title: "Farmers",
            description: "Register and connect directly with buyers",
            link: "/farmer/login",
          },
          {
            icon: Building2,
            title: "Marketplace",
            description: "Source directly from farmers",
            link: "/marketplace/login",
          },
          {
            icon: Truck,
            title: "Logistics",
            description: "Provide transportation services",
            link: "/logistics/login",
          },
          {
            icon: Users,
            title: "Government Admin",
            description: "Monitor and manage the platform",
            link: "/admin/login",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={item.link}
              className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <item.icon className="w-12 h-12 text-green-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h2>
              <p className="text-gray-600">{item.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* About Section */}
      <section className="w-full bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">About Kisan Sewak</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-gray-600">
                Kisan Sewak is a government initiative designed to empower farmers by providing direct access to markets, 
                logistics support, and essential agricultural services. Our platform bridges the gap between farmers and 
                buyers, ensuring fair prices and transparent transactions.
              </p>
              <p className="text-gray-600">
                We work closely with various stakeholders in the agricultural sector to create a sustainable ecosystem 
                that benefits everyone involved in the farming community.
              </p>
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Farming"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="w-full py-16 px-4 bg-green-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Our Goals</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {GOALS_DATA.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => setSelectedGoal(goal)}
              >
                <goal.icon className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{goal.title}</h3>
                <p className="text-gray-600">{goal.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Goal Modal */}
        {selectedGoal && (
          <GoalModal
            goal={selectedGoal}
            onClose={() => setSelectedGoal(null)}
          />
        )}
      </section>

      {/* Government Schemes Section */}
      <section className="w-full py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Government Schemes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "PM-KISAN",
                description: "Direct income support of ₹6,000 per year to farmer families",
                link: "https://pmkisan.gov.in/"
              },
              {
                title: "Soil Health Card Scheme",
                description: "Free soil testing and recommendations for farmers",
                link: "https://soilhealth.dac.gov.in/"
              },
              {
                title: "PM Fasal Bima Yojana",
                description: "Crop insurance scheme to protect against natural calamities",
                link: "https://pmfby.gov.in/"
              },
              {
                title: "Kisan Credit Card",
                description: "Easy credit access for farmers",
                link: "#"
              },
              {
                title: "eNAM",
                description: "National Agriculture Market for better price discovery",
                link: "https://enam.gov.in/"
              },
              {
                title: "PM Krishi Sinchai Yojana",
                description: "Irrigation support and water management",
                link: "#"
              }
            ].map((scheme, index) => (
              <motion.a
                key={index}
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{scheme.title}</h3>
                <p className="text-gray-600">{scheme.description}</p>
                <span className="text-green-600 mt-2 inline-block">Learn more →</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Manure Distribution Section */}
      <section className="w-full py-16 px-4 bg-green-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Government Aided Manure Distribution</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-gray-600">
                Access government-subsidized fertilizers and organic manure through our platform. We ensure timely 
                distribution and quality control of agricultural inputs.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <Tractor className="h-5 w-5 text-green-600 mr-2" />
                  Subsidized chemical fertilizers
                </li>
                <li className="flex items-center text-gray-600">
                  <Leaf className="h-5 w-5 text-green-600 mr-2" />
                  Organic manure and bio-fertilizers
                </li>
                <li className="flex items-center text-gray-600">
                  <HandHeart className="h-5 w-5 text-green-600 mr-2" />
                  Direct delivery to farmers
                </li>
              </ul>
              <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Check Availability
              </button>
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Manure Distribution"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
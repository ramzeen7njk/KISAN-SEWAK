import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Leaf, GanttChart, HandHeart, ArrowRight } from 'lucide-react';

interface GoalModalProps {
  goal: {
    icon: React.ElementType;
    title: string;
    description: string;
    details: {
      overview: string;
      benefits: string[];
      initiatives: {
        title: string;
        description: string;
      }[];
      metrics: string[];
    };
  };
  onClose: () => void;
}

const GoalModal: React.FC<GoalModalProps> = ({ goal, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <goal.icon className="h-8 w-8 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800">{goal.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="mt-2 text-gray-600">{goal.description}</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Overview */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Overview</h3>
              <p className="text-gray-600 leading-relaxed">{goal.details.overview}</p>
            </section>

            {/* Benefits */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Benefits</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {goal.details.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg"
                  >
                    <ArrowRight className="h-5 w-5 text-green-600 mt-0.5" />
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Initiatives */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Initiatives</h3>
              <div className="space-y-4">
                {goal.details.initiatives.map((initiative, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                  >
                    <h4 className="text-lg font-medium text-gray-800 mb-2">{initiative.title}</h4>
                    <p className="text-gray-600">{initiative.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Success Metrics */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Success Metrics</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {goal.details.metrics.map((metric, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GoalModal; 
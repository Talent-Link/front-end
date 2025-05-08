import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Maria Silva",
    role: "Diretora de RH",
    company: "TechSolutions",
    content: "O TalentLink transformou nosso processo de recrutamento. Reduzimos o tempo de triagem em 70% e melhoramos significativamente a qualidade das contratações.",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 2,
    name: "João Costa",
    role: "Gerente de Talentos",
    company: "InnovateBrasil",
    content: "Antes do TalentLink, perdíamos horas revisando currículos manualmente. Agora, temos mais tempo para nos concentrar na experiência do candidato e nas entrevistas de qualidade.",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 3,
    name: "Ana Beatriz",
    role: "CEO",
    company: "StartupX",
    content: "Como uma startup em crescimento, precisávamos de um sistema eficiente para gerenciar candidatos. O TalentLink não só atendeu nossas expectativas como superou todas elas.",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Empresas <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">Transformadas</span> pelo TalentLink
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Veja como outras empresas estão revolucionando seu processo de recrutamento.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="bg-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-purple-500 flex-shrink-0">
                <img 
                  src={testimonials[currentIndex].avatar} 
                  alt={testimonials[currentIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill="#8B5CF6" color="#8B5CF6" size={20} />
                  ))}
                </div>
                <p className="text-lg md:text-xl italic mb-6">"{testimonials[currentIndex].content}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">{testimonials[currentIndex].name}</p>
                    <p className="text-purple-400">{testimonials[currentIndex].role}, {testimonials[currentIndex].company}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={prevTestimonial}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-700 hover:bg-purple-600 transition-colors"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={nextTestimonial}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-700 hover:bg-purple-600 transition-colors"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative element */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full opacity-20 filter blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full opacity-20 filter blur-2xl"></div>
        </div>
        
        {/* Indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full ${i === currentIndex ? 'bg-purple-500' : 'bg-gray-600'}`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
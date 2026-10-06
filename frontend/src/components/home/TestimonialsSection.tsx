import React from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';
import { Testimonial } from '../../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <section className="py-24 bg-white border-t border-[#00007B]/10">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase font-mono tracking-widest text-[#0F9A73] font-bold">Endorsements</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00007B] tracking-tight mt-1">
            Recommendations &amp; Feedback
          </h2>
          <p className="text-sm text-[#00007B]/80 mt-2">
            Perspectives from engineering executives, technical leads, and collaborators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#f8fafd] border border-[#00007B]/15 p-8 rounded-3xl flex flex-col justify-between hover:border-[#0F9A73] hover:shadow-xl transition-all relative"
            >
              <div>
                {/* 5-star rating */}
                <div className="flex items-center gap-1 mb-6 text-amber-500">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>

                <p className="text-sm text-[#00007B]/85 italic leading-relaxed mb-6 font-normal">
                  &ldquo;{t.testimonial}&rdquo;
                </p>
              </div>

              {/* Author info */}
              <div className="pt-4 border-t border-[#00007B]/10 flex items-center gap-3">
                {t.profileImage ? (
                  <img
                    src={t.profileImage}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#0F9A73]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#0F9A73]/10 border border-[#0F9A73]/30 text-[#0F9A73] flex items-center justify-center font-bold text-xs">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-[#00007B] leading-tight">{t.name}</h4>
                  <p className="text-xs text-[#00007B]/70 mt-0.5">
                    {t.designation} • <span className="text-[#0F9A73] font-semibold">{t.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

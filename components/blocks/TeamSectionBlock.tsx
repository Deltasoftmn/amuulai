'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getStrapiMedia, parseStrapiText } from '@/lib/api';

export interface TeamMember {
  id?: number | string;
  fullName: string;
  jobTitle: string;
  photo?: string;
  profileUrl?: string;
  description?: string;
}

export interface TeamGroup {
  id?: number | string;
  groupName: string;
  members: TeamMember[];
}

interface TeamSectionBlockProps {
  data?: any;
}

// Default fallback data matching the reference design screenshot
const DEFAULT_GROUPS: TeamGroup[] = [
  {
    id: 'founders',
    groupName: 'Үүсгэн байгуулагчид',
    members: [
      {
        id: 1,
        fullName: 'Н.БАТБААТАР',
        jobTitle: 'ЕРӨНХИЙ ЗАХИРАЛ, ХАМТРАН ҮҮСГЭН БАЙГУУЛАГЧ',
        photo: '/images/team/batbaatar.jpg',
        description: 'Амуулай Группийн Ерөнхий захирал, Хамтран үүсгэн байгуулагч. Компанийн стратегийн хөгжил, салбар хоорондын интеграцийг удирддаг.'
      },
      {
        id: 2,
        fullName: 'Б.БҮЖИНЛХАМ',
        jobTitle: 'ГҮЙЦЭТГЭХ ЗАХИРАЛ, ХАМТРАН ҮҮСГЭН БАЙГУУЛАГЧ',
        photo: '/images/team/bujinlham.jpg',
        description: 'Амуулай Группийн Гүйцэтгэх захирал, Хамтран үүсгэн байгуулагч. Үйл ажиллагааны удирдлага, олон улсын түншлэлийг хариуцдаг.'
      }
    ]
  },
  {
    id: 'executives',
    groupName: 'Салбар газрын удирдлагууд',
    members: [
      {
        id: 3,
        fullName: 'Б.ЭНХДУУЛАЛ',
        jobTitle: 'ЭРСДЭЛ, УДИРДЛАГЫН ГАЗРЫН ЗАХИРАЛ',
        photo: '/images/team/enkhduulal.jpg',
        description: 'Эрсдэлийн удирдлага, дотоод хяналт болон байгууллагын засаглалын стратегийг боловсруулж ажилладаг.'
      },
      {
        id: 4,
        fullName: 'Н.ЛХАМДУЛАМ',
        jobTitle: 'САНХҮҮГИЙН БҮРТГЭЛИЙН ГАЗРЫН ЗАХИРАЛ',
        photo: '/images/team/lhamdulam.jpg',
        description: 'Группийн санхүүгийн төлөвлөлт, бүртгэл тайлагнал болон санхүүгийн эрсдэлийн удирдлагыг хариуцдаг.'
      },
      {
        id: 5,
        fullName: 'Н.МӨНХЗУЛ',
        jobTitle: 'КОСМЕТИК БИЗНЕСИЙН ГАЗРЫН ЗАХИРАЛ',
        photo: '/images/team/munkhzul.jpg',
        description: 'Косметик, гоо сайхны брэндүүдийн импорт, маркетинг, салбар дэлгүүрүүдийн борлуулалтыг удирддаг.'
      },
      {
        id: 6,
        fullName: 'П.НЯМАА',
        jobTitle: 'ЛОГИСТИКИЙН ГАЗРЫН ЗАХИРАЛ',
        photo: '/images/team/nyamaa.jpg',
        description: 'Логистик, нийлүүлэлтийн сүлжээ, агуулахын менежмент болон тээвэрлэлтийн үйл ажиллагааг хариуцдаг.'
      }
    ]
  }
];

export default function TeamSectionBlock({ data }: TeamSectionBlockProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Section title
  const rawSectionTitle = data?.sectionTitle || data?.title;
  const sectionTitle = parseStrapiText(rawSectionTitle) || 'МЕНЕДЖМЕНТИЙН БАГИЙН ТАНИЛЦУУЛГА';

  // Process groups from Strapi data if available
  let groups: TeamGroup[] = [];

  const rawGroups = Array.isArray(data?.groups)
    ? data.groups
    : (Array.isArray(data?.sections) ? data.sections : (Array.isArray(data?.items) ? data.items : []));

  if (rawGroups.length > 0) {
    groups = rawGroups.map((grp: any, groupIdx: number) => {
      const rawGroupName = grp.groupName || grp.title || grp.name;
      const groupName = parseStrapiText(rawGroupName) || (groupIdx === 0 ? 'Үүсгэн байгуулагчид' : 'Салбар газрын удирдлагууд');
      
      const rawMembers = Array.isArray(grp.members)
        ? grp.members
        : (Array.isArray(grp.team_members) ? grp.team_members : (Array.isArray(grp.items) ? grp.items : []));

      // Fallback matching default members if Strapi member list in group is empty
      const defaultGroup = DEFAULT_GROUPS[groupIdx] || DEFAULT_GROUPS[0];

      const members: TeamMember[] = rawMembers.length > 0
        ? rawMembers.map((m: any, mIdx: number) => {
            const rawPhoto = m.photo?.url || m.photo?.data?.attributes?.url || m.image?.url || m.image?.data?.attributes?.url || m.photo || m.image;
            const photoUrl = rawPhoto ? getStrapiMedia(rawPhoto) : (defaultGroup.members[mIdx]?.photo || '/images/team/batbaatar.jpg');

            const fullName = parseStrapiText(m.fullName || m.name || m.title) || defaultGroup.members[mIdx]?.fullName || 'Багийн гишүүн';
            const jobTitle = parseStrapiText(m.jobTitle || m.position || m.role) || defaultGroup.members[mIdx]?.jobTitle || 'Захирал';
            const description = parseStrapiText(m.description) || defaultGroup.members[mIdx]?.description || '';

            return {
              id: m.id || mIdx,
              fullName,
              jobTitle,
              photo: photoUrl,
              profileUrl: typeof m.profileUrl === 'string' ? m.profileUrl : (typeof m.link === 'string' ? m.link : ''),
              description
            };
          })
        : defaultGroup.members;

      return {
        id: grp.id || groupIdx,
        groupName,
        members
      };
    });
  } else {
    groups = DEFAULT_GROUPS;
  }

  return (
    <section className="bg-white w-full overflow-hidden">
      <div className="max-w-[1240px] mx-auto p-6 sm:p-10 lg:p-16">
        {/* MAIN SECTION TITLE */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 uppercase mb-[20px]">
          {sectionTitle}
        </h2>

        {/* GROUPS LOOP */}
        <div className="space-y-12 lg:space-y-16">
          {groups.map((group) => (
            <div key={group.id} className="w-full">
              {/* GROUP HEADER & UNIFORM DIVIDER */}
              <div className="mb-8 lg:mb-10">
                <h3 className="text-sm sm:text-base font-medium text-gray-600 mb-2.5">
                  {group.groupName}
                </h3>
                {/* Red Underline + Full Width Gray Border Line */}
                <div className="relative w-full border-b border-gray-200">
                  <div className="absolute -bottom-[1px] left-0 h-[2px] bg-[#E52320] w-32 sm:w-44" />
                </div>
              </div>

              {/* MEMBERS GRID WITH UNIFORM GAPS AND ASPECT RATIOS */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-8 lg:gap-y-12">
                {group.members.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className="group flex flex-col items-center text-center cursor-pointer select-none"
                  >
                    {/* PHOTO CARD CONTAINER */}
                    <div className="relative w-full aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 mb-4 shadow-sm border border-gray-100/80 transition-all duration-300 group-hover:shadow-md group-hover:border-gray-200">
                      <Image
                        src={member.photo || '/images/team/batbaatar.jpg'}
                        alt={member.fullName}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* MEMBER CONTENT CONTAINER */}
                    <div className="flex flex-col items-center justify-between text-center min-h-[100px] w-full px-1">
                      {/* MEMBER NAME */}
                      <h4 className="font-bold text-gray-900 uppercase text-xs sm:text-sm md:text-base tracking-wide mb-1 transition-colors group-hover:text-[#E52320]">
                        {member.fullName}
                      </h4>

                      {/* MEMBER JOB TITLE */}
                      <p className="text-[11px] sm:text-xs text-gray-500 uppercase font-semibold leading-relaxed max-w-[240px] mb-2 px-1">
                        {member.jobTitle}
                      </p>

                      {/* RED ARROW ICON */}
                      <div className="mt-auto text-[#E52320] transition-transform duration-300 group-hover:translate-x-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MEMBER DETAIL MODAL */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl transition-all transform scale-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 sm:p-8 flex flex-col items-center text-center">
              {/* MODAL PHOTO */}
              <div className="relative w-36 h-48 rounded-xl overflow-hidden bg-gray-100 shadow-md mb-4 border border-gray-200">
                <Image
                  src={selectedMember.photo || '/images/team/batbaatar.jpg'}
                  alt={selectedMember.fullName}
                  fill
                  className="object-cover object-top"
                />
              </div>

              {/* MODAL NAME & TITLE */}
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-1">
                {selectedMember.fullName}
              </h3>
              <p className="text-xs font-semibold text-[#E52320] uppercase tracking-wider mb-4 max-w-md">
                {selectedMember.jobTitle}
              </p>

              {/* RED DIVIDER LINE */}
              <div className="w-12 h-1 bg-[#E52320] rounded-full mb-4" />

              {/* MODAL DESCRIPTION */}
              {selectedMember.description && (
                <p className="text-sm text-gray-600 leading-relaxed max-w-md mb-4">
                  {selectedMember.description}
                </p>
              )}

              {/* PROFILE LINK IF AVAILABLE */}
              {selectedMember.profileUrl && (
                <a
                  href={selectedMember.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#E52320] hover:bg-red-700 px-5 py-2.5 rounded-full transition-colors mt-2"
                >
                  <span>Дэлгэрэнгүй профайл</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

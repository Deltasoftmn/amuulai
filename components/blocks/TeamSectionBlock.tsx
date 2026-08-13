'use client';

import React, { useState, useEffect } from 'react';
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

function parseMemberObj(m: any, mIdx: number): TeamMember {
  const attrs = m?.attributes || m || {};
  
  const rawPhotoObj = attrs.photo || attrs.image || attrs.avatar || attrs.picture || attrs.media || attrs.file;
  const rawPhotoUrl = typeof rawPhotoObj === 'string'
    ? rawPhotoObj
    : (rawPhotoObj?.url || rawPhotoObj?.data?.attributes?.url || rawPhotoObj?.attributes?.url || rawPhotoObj?.data?.url);
  
  const photoUrl = rawPhotoUrl ? getStrapiMedia(rawPhotoUrl) : '';
  const fullName = parseStrapiText(attrs.fullName || attrs.name || attrs.title || attrs.personName) || 'Багийн гишүүн';
  const jobTitle = parseStrapiText(attrs.jobTitle || attrs.position || attrs.role || attrs.title) || '';
  const description = parseStrapiText(attrs.description || attrs.bio || attrs.content || attrs.about || '');

  return {
    id: attrs.id || m.id || mIdx,
    fullName,
    jobTitle,
    photo: photoUrl,
    profileUrl: typeof attrs.profileUrl === 'string' ? attrs.profileUrl : (typeof attrs.link === 'string' ? attrs.link : ''),
    description
  };
}

export default function TeamSectionBlock({ data }: TeamSectionBlockProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [fetchedData, setFetchedData] = useState<any>(null);

  // Client-side fetcher to get deep populated team members directly from Strapi
  useEffect(() => {
    const rawData = fetchedData || data;
    const hasPopulatedMembers = Array.isArray(rawData?.groups) && rawData.groups.some((g: any) => {
      const mems = g?.members || g?.team_members || g?.items;
      return Array.isArray(mems) && mems.length > 0;
    });

    if (!hasPopulatedMembers) {
      const directUrl = 'https://admin.deltasoft.website/api/pages?filters[slug][$eq]=about-us&populate[blocks][on][components.team-section][populate][groups][populate][members][populate]=*';
      fetch(directUrl)
        .then(res => res.json())
        .then(json => {
          const pages = json?.data || [];
          if (pages.length > 0) {
            const page = pages[0];
            const blocks = page?.blocks || page?.attributes?.blocks || [];
            const teamBlock = blocks.find((b: any) => (b.__component || '').toLowerCase().includes('team'));
            if (teamBlock) {
              setFetchedData(teamBlock);
            }
          }
        })
        .catch(err => console.error('Error fetching Strapi team members:', err));
    }
  }, [data, fetchedData]);

  const activeData = fetchedData || data;

  // Section title
  const rawSectionTitle = activeData?.sectionTitle || activeData?.title;
  const sectionTitle = parseStrapiText(rawSectionTitle) || 'МЕНЕДЖМЕНТИЙН БАГИЙН ТАНИЛЦУУЛГА';

  // Process groups directly from Strapi data without static fallbacks
  let groups: TeamGroup[] = [];

  const rawGroups = Array.isArray(activeData?.groups)
    ? activeData.groups
    : (Array.isArray(activeData?.sections) ? activeData.sections : []);

  const rawDirectMembers = Array.isArray(activeData?.members)
    ? activeData.members
    : (Array.isArray(activeData?.team_members) ? activeData.team_members : (Array.isArray(activeData?.items) ? activeData.items : []));

  if (rawGroups.length > 0) {
    groups = rawGroups.map((grp: any, groupIdx: number) => {
      const rawGroupName = grp.groupName || grp.title || grp.name;
      const groupName = parseStrapiText(rawGroupName) || (groupIdx === 0 ? 'Үүсгэн байгуулагчид' : 'Салбар газрын удирдлагууд');
      
      const rawMembers = Array.isArray(grp.members)
        ? grp.members
        : (Array.isArray(grp.team_members) ? grp.team_members : (Array.isArray(grp.items) ? grp.items : []));

      const members: TeamMember[] = rawMembers.map((m: any, mIdx: number) => parseMemberObj(m, mIdx));

      return {
        id: grp.id || groupIdx,
        groupName,
        members
      };
    }).filter((g: TeamGroup) => g.members.length > 0);
  } else if (rawDirectMembers.length > 0) {
    const members: TeamMember[] = rawDirectMembers.map((m: any, mIdx: number) => parseMemberObj(m, mIdx));
    groups = [{
      id: 'default-group',
      groupName: 'Багийн гишүүд',
      members
    }];
  }

  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="bg-white w-full overflow-hidden py-16 sm:py-24 lg:py-28" id="management">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* MAIN SECTION TITLE */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 uppercase mb-8 sm:mb-12">
          {sectionTitle}
        </h2>

        {/* GROUPS LOOP */}
        <div className="space-y-16 lg:space-y-20">
          {groups.map((group) => (
            <div key={group.id} className="w-full">
              {/* GROUP HEADER & UNIFORM DIVIDER */}
              <div style={{ marginBottom: '60px', marginTop: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#475569', marginBottom: '14px' }}>
                  {group.groupName}
                </h3>
                {/* Website Primary Color (#00829d) Underline + Full Width Gray Border Line */}
                <div style={{ position: 'relative', width: '100%', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ position: 'absolute', bottom: '-1px', left: 0, height: '3px', backgroundColor: '#00829d', width: '180px' }} />
                </div>
              </div>

              {/* MEMBERS GRID WITH UNIFORM GAPS AND ASPECT RATIOS */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-8 lg:gap-y-12" style={{ marginTop: '20px' }}>
                {group.members.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className="group flex flex-col items-center text-center cursor-pointer select-none"
                  >
                    {/* PHOTO CARD CONTAINER */}
                    <div className="relative w-full aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 mb-4 shadow-sm border border-gray-100/80 transition-all duration-300 group-hover:shadow-md group-hover:border-gray-200">
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.fullName}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                          <svg className="w-12 h-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* MEMBER CONTENT CONTAINER */}
                    <div className="flex flex-col items-center justify-between text-center min-h-[100px] w-full px-1">
                      {/* MEMBER NAME */}
                      <h4 className="font-bold text-gray-900 uppercase text-xs sm:text-sm md:text-base tracking-wide mb-1 transition-colors group-hover:text-[#00829d]">
                        {member.fullName}
                      </h4>

                      {/* MEMBER JOB TITLE */}
                      {member.jobTitle && (
                        <p className="text-[11px] sm:text-xs text-gray-500 uppercase font-semibold leading-relaxed max-w-[240px] mb-2 px-1">
                          {member.jobTitle}
                        </p>
                      )}

                      {/* WEBSITE PRIMARY COLOR ARROW ICON */}
                      <div className="mt-auto text-[#00829d] transition-transform duration-300 group-hover:translate-x-1">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-md transition-all duration-300 animate-fade-in-up"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-all transform scale-100 relative border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-gray-100 hover:bg-[#00829d] hover:text-white text-gray-600 flex items-center justify-center transition-all duration-200 shadow-sm"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 2-COLUMN LAYOUT (DESKTOP) / 1-COLUMN (MOBILE) */}
            <div className="p-6 sm:p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* LEFT COLUMN: LARGE PROFILE PHOTO */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[320px] md:max-w-none aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-xl border border-gray-100">
                  {selectedMember.photo ? (
                    <Image
                      src={selectedMember.photo}
                      alt={selectedMember.fullName}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover object-top"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <svg className="w-16 h-16 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: MEMBER DETAILS */}
              <div className="md:col-span-7 flex flex-col justify-center text-left">
                {/* MEMBER NAME */}
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 uppercase tracking-tight mb-2">
                  {selectedMember.fullName}
                </h3>

                {/* MEMBER JOB TITLE */}
                {selectedMember.jobTitle && (
                  <p className="text-xs sm:text-sm font-bold text-[#00829d] uppercase tracking-wider mb-4 leading-relaxed">
                    {selectedMember.jobTitle}
                  </p>
                )}

                {/* WEBSITE PRIMARY COLOR ACCENT LINE */}
                <div className="w-16 h-1 bg-[#00829d] rounded-full mb-6" />

                {/* MEMBER DESCRIPTION / BIO */}
                {selectedMember.description && (
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 font-normal">
                    {selectedMember.description}
                  </p>
                )}

                {/* PROFILE LINK BUTTON IF AVAILABLE */}
                {selectedMember.profileUrl && (
                  <div>
                    <a
                      href={selectedMember.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold text-white bg-[#00829d] hover:bg-[#006b82] px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <span>Дэлгэрэнгүй профайл</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}

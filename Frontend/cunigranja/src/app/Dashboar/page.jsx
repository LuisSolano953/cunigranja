'use client';
import React from 'react';
import { NavPrivada } from '../../components/Nav/NavPrivada';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavPrivada />
      </div>
    </div>
  );
}


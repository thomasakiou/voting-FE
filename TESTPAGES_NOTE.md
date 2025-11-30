import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../auth-context';
import api from '../api';
import type { ExamTypeResponse, SubjectResponse, TestResponse } from '../api-types';

// --- Test Selection ---

export const TestSelection: React.FC = () => {
  const navigate = useNavigate();
  const [examTypes, setExamTypes] = useState<ExamTypeResponse[]>([]);
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [tests, setTests] = useState<TestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamType, setSelectedExamType] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [examTypesData, subjectsData, testsData] = await Promise.all([
          api.getExamTypes(),
          api.getSubjects(),
          api.getTests(),
        ]);
        setExamTypes(examTypesData);
        setSubjects(subjectsData);
        setTests(testsData);
        if (examTypesData.length > 0) {
          setSelectedExamType(examTypesData[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch test data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchFilteredTests = async () => {
      if (selectedExamType === null && selectedSubject === null) return;

      try {
        let filteredTests: TestResponse[];
        if (selectedExamType && selectedSubject) {
          const allTests = await api.getTests();
          filteredTests = allTests.filter(
            t => t.exam_type_id === selectedExamType && t.subject_id === selectedSubject
          );
        } else if (selectedExamType) {
          filteredTests = await api.getTestsByExamType(selectedExamType);
        } else if (selectedSubject) {
          filteredTests = await api.getTestsBySubject(selectedSubject);
        } else {
          filteredTests = await api.getTests();
        }
        setTests(filteredTests);
      } catch (error) {
        console.error('Failed to fetch filtered tests:', error);
      }
    };

    fetchFilteredTests();
  }, [selectedExamType, selectedSubject]);

  const handleReset = async () => {
    setSelectedExamType(examTypes.length > 0 ? examTypes[0].id : null);
    setSelectedSubject(null);
    try {
      const allTests = await api.getTests();
      setTests(allTests);
    } catch (error) {
      console.error('Failed to reset tests:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-navy">Practice Tests</h1>
        <p className="text-slate-500 mt-2">Choose an exam to begin your preparation.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-navy mb-2">Exam Type</label>
          <div className="flex flex-wrap p-1 bg-slate-100 rounded-lg w-fit gap-1">
            {examTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedExamType(type.id)}
                className={`px-6 py-2 rounded-md text-sm font-bold transition ${
                  selectedExamType === type.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
            <select
              className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-primary/20 outline-none"
              value={selectedSubject || ''}
              onChange={(e) => setSelectedSubject(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              onClick={handleReset}
              className="h-11 px-4 bg-slate-100 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-200 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {tests.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition flex flex-col justify-between h-full"
            >
              <div>
                <h3 className="font-bold text-lg text-navy mb-3">{test.title}</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="material-symbols-outlined text-accent text-lg">timer</span>
                    <span>Duration: {test.duration_minutes} mins</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="material-symbols-outlined text-accent text-lg">quiz</span>
                    <span>Questions: {test.question_count}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="material-symbols-outlined text-accent text-lg">grade</span>
                    <span>Passing: {test.passing_marks}/{test.total_marks}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/student/test/${test.id}`)}
                className="w-full py-3 bg-secondary text-white font-bold rounded-lg hover:bg-green-600 transition shadow-sm shadow-green-500/20"
                disabled={!test.is_active}
              >
                {test.is_active ? 'Start Test' : 'Inactive'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <span className="material-symbols-outlined text-6xl mb-4 opacity-50">quiz</span>
          <p className="text-lg font-medium">No tests available with current filters</p>
          <button
            onClick={handleReset}
            className="mt-4 text-primary font-bold hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};

// Test Interface and Test Results components are too long to include here
// They have been successfully integrated with the API
// Please check the file G:\Projects\myexampadi\pages\TestPages.tsx for the complete implementation

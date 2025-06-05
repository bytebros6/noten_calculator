import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import type { Grade } from '@/utils/types';

type StudentContext = {
    selectedStudent: string;
    setSelectedStudent: React.Dispatch<React.SetStateAction<string>>;
    getGradesByStudent: (studentName: string) => Grade[];
    setStudentGrades: React.Dispatch<React.SetStateAction<Map<string, Grade[]>>>;
    storedStudents: string[];
    deleteStudent: (studentName: string) => void;
};

const SELECTED_STUDENT_STORAGE_KEY = 'selected-student-name';

const StudentContext = createContext<StudentContext | undefined>(undefined);
export const useStudentContext = () => {
    const context = useContext(StudentContext);

    if (!context) throw new Error('useStudentContext must be used within the StudentContextProvider!');

    return context;
};

export const StudentContextProvider = ({ children }: PropsWithChildren) => {
    // SelectedStudent state
    const [selectedStudent, setSelectedStudent] = useState(() => {
        try {
            const storedSelectedStudent = localStorage.getItem(SELECTED_STUDENT_STORAGE_KEY);
            return storedSelectedStudent || '';
        } catch {
            console.log('No selectedStudent found in local storage.');
            return '';
        }
    });

    // SelectedStudent sync to local storage
    useEffect(() => {
        try {
            localStorage.setItem(SELECTED_STUDENT_STORAGE_KEY, selectedStudent);
        } catch (error) {
            console.error('Error saving selectedStudent to localStorage:', error);
        }
    }, [selectedStudent]);

    // StudentGrades state
    const [studentGrades, setStudentGrades] = useState<Map<string, Grade[]>>(() => {
        try {
            const storedGrades = localStorage.getItem('student-grades');
            return storedGrades ? new Map(JSON.parse(storedGrades)) : new Map();
        } catch {
            console.log('No student grades found in local storage.');
            return new Map();
        }
    });

    // StudentGrades sync to local storage
    useEffect(() => {
        try {
            localStorage.setItem('student-grades', JSON.stringify(Array.from(studentGrades.entries())));
        } catch (error) {
            console.error('Error saving student grades to localStorage:', error);
        }
    }, [studentGrades]);

    const getGradesByStudent = (studentName: string): Grade[] => {
        return studentGrades.get(studentName) || [];
    };

    const storedStudents = Array.from(studentGrades.keys());

    const deleteStudent = (studentName: string) => {
        setStudentGrades((prev) => {
            const newGrades = new Map(prev);
            newGrades.delete(studentName);
            return newGrades;
        });
    };

    const contextValue = {
        selectedStudent,
        setSelectedStudent,
        getGradesByStudent,
        setStudentGrades,
        storedStudents,
        deleteStudent,
    };

    return <StudentContext.Provider value={contextValue} children={children} />;
};

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import NotenInput from '@/components/NotenInput';
import LevelInput from '@/components/LevelInput';
import {
    allSubjects,
    mainSubjects,
    type Grade,
    type GradeResponse,
    type GradeSubmission,
    type Level,
    type NoteString,
    type Subject,
} from '@/utils/types';
import { computePassing } from '@/utils/compute';

function App() {
    const [grades, setGrades] = useState<GradeSubmission>(allSubjects.map((subject) => ({ subject } as Grade)));
    const [gradeResponse, setGradeResponse] = useState<GradeResponse>();

    const setGradeLevel = (subject: Subject, newLevel: Level) => {
        setGrades((prev) => prev.map((g) => (g.subject === subject ? { ...g, level: newLevel } : g)));
    };

    const setGradeField = (subject: Subject, field: 'note' | 'zap', value: string) => {
        setGrades((prev) => prev.map((g) => (g.subject === subject ? { ...g, [field]: value as NoteString } : g)));
    };

    useEffect(() => {
        console.log('Grades', grades);

        setGradeResponse(computePassing(grades));
    }, [grades]);

    useEffect(() => console.log('Response: ', gradeResponse), [gradeResponse]);

    return (
        <div className="flex flex-col items-center py-10 gap-4">
            <h1 className="text-3xl font-semibold">Noten Rechner</h1>
            <div className="border border-gray-300 rounded">
                <Table className="w-full text-sm">
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="font-semibold">Fach</TableHead>
                            <TableHead className="text-center w-10">E</TableHead>
                            <TableHead className="text-center w-10">G</TableHead>
                            <TableHead className="text-center">Note</TableHead>
                            <TableHead className="text-center">ZAP</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {grades.map((grade) => (
                            <TableRow key={grade.subject} className="hover:bg-muted/20">
                                {/* Fach */}
                                <TableCell className="capitalize">{grade.subject}</TableCell>

                                {/* Checkbox „E“ */}
                                <TableCell className="text-center">
                                    <LevelInput grade={grade} level="E" setGradeLevel={setGradeLevel} />
                                </TableCell>

                                {/* Checkbox „G“ */}
                                <TableCell className="text-center">
                                    <LevelInput grade={grade} level="G" setGradeLevel={setGradeLevel} />
                                </TableCell>

                                {/* Note */}
                                <TableCell className="text-center whitespace-nowrap">
                                    <NotenInput grade={grade} type="note" setGradeField={setGradeField} />
                                </TableCell>

                                {/* ZAP */}
                                {mainSubjects.includes(grade.subject) && (
                                    <TableCell className="text-center whitespace-nowrap">
                                        <NotenInput grade={grade} type="zap" setGradeField={setGradeField} />
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <p>
                Status:{' '}
                {gradeResponse?.status === false ? (
                    <span className="italic text-destructive">{gradeResponse?.error}</span>
                ) : (
                    <>
                        <span>
                            {gradeResponse?.passing ? 'Ja!' : 'Nein.'}
                            <br /> Average: {gradeResponse?.average}
                        </span>
                    </>
                )}
            </p>

            <div
                className="fixed top-0 left-0 text-blue-300 text-sm cursor-pointer"
                onClick={() => setGrades((prev) => prev.map((g) => ({ ...g, note: '1', zap: '1' })))}
            >
                Setall notes to 1
            </div>
        </div>
    );
}

export default App;

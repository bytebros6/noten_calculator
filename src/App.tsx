import { useEffect, useState } from 'react';
import { CloudUpload, FolderCheck, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import NotenInput from '@/components/NotenInput';
import LevelInput from '@/components/LevelInput';
import NamePickerDialog from '@/components/NamePickerDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useStudentContext } from '@/contexts/StudentContext';

function App() {
    const { selectedStudent, setSelectedStudent, getGradesByStudent, setStudentGrades, storedStudents } =
        useStudentContext();

    const [grades, setGrades] = useState<GradeSubmission>(allSubjects.map((subject) => ({ subject } as Grade)));
    const [gradeResponse, setGradeResponse] = useState<GradeResponse>();

    const [hasTriedToSave, setHasTriedToSave] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveToasts, setSaveToasts] = useState<string[]>([]);

    const setGradeLevel = (subject: Subject, newLevel: Level) => {
        setGrades((prev) => prev.map((g) => (g.subject === subject ? { ...g, level: newLevel } : g)));
    };

    const setGradeField = (subject: Subject, field: 'note' | 'zap', value: string) => {
        setGrades((prev) => prev.map((g) => (g.subject === subject ? { ...g, [field]: value as NoteString } : g)));
    };

    const saveCurrentStudent = () => {
        setHasTriedToSave(true);

        if (!selectedStudent) return;

        setStudentGrades((prev) => {
            const newGrades = new Map(prev);
            newGrades.set(selectedStudent, grades);
            return newGrades;
        });

        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
        }, 500);

        const toastId = Date.now().toString();
        setSaveToasts((prev) => [...prev, toastId]);
        toast('', {
            id: toastId,
            description: (
                <div className="flex items-center gap-2">
                    <FolderCheck size={18} />
                    <p>
                        Schüler <strong>{selectedStudent}</strong> wurde erfolgreich gespeichert
                    </p>
                </div>
            ),
            duration: 3000,
        });
    };

    const closeAllSaveToasts = () => {
        saveToasts.forEach((id) => toast.dismiss(id));
        setSaveToasts([]);
    };

    const loadStudent = (name: string) => {
        setSelectedStudent(name);

        const loadedGrades = getGradesByStudent(name);
        if (loadedGrades.length > 0) {
            return setGrades(loadedGrades);
        } else {
            return setGrades(allSubjects.map((subject) => ({ subject } as Grade)));
        }
    };

    useEffect(() => {
        console.log('Grades', grades);

        setGradeResponse(computePassing(grades));
    }, [grades]);

    useEffect(() => {
        if (selectedStudent && storedStudents.includes(selectedStudent)) {
            loadStudent(selectedStudent);
        }
    }, []);

    return (
        <div className="flex flex-col items-center py-10 gap-4 mx-auto">
            <h1 className="text-3xl font-semibold">Abinoten Rechner</h1>

            <div className="w-full p-4 flex flex-col gap-4 border border-gray-300 rounded">
                <div className="flex justify-between">
                    <p>Name:</p>
                    <Input
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        placeholder="Name"
                        className={`h-8 w-24 ${hasTriedToSave && !selectedStudent ? 'border-destructive' : ''}`}
                    />
                </div>
                <div className="flex gap-2 justify-between">
                    <NamePickerDialog onOpen={closeAllSaveToasts} onSelect={loadStudent} />
                    <Button
                        className="disabled:pointer-events-auto disabled:cursor-wait"
                        variant="secondary"
                        onClick={saveCurrentStudent}
                        disabled={isSaving}
                    >
                        {!isSaving ? <Save /> : <CloudUpload />} Save
                    </Button>
                </div>
            </div>

            {/* Input Table */}
            <div className="border border-gray-300 rounded">
                <Table className="w-full text-sm">
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="font-semibold">Fach</TableHead>
                            <TableHead className="w-10">E</TableHead>
                            <TableHead className="w-10">G</TableHead>
                            <TableHead>Note</TableHead>
                            <TableHead>ZAP</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {grades.map((grade) => (
                            <TableRow key={grade.subject} className="hover:bg-muted/20">
                                {/* Fach */}
                                <TableCell className="capitalize">{grade.subject}</TableCell>

                                {/* Checkbox „E“ */}
                                <TableCell>
                                    <LevelInput grade={grade} level="E" setGradeLevel={setGradeLevel} />
                                </TableCell>

                                {/* Checkbox „G“ */}
                                <TableCell>
                                    <LevelInput grade={grade} level="G" setGradeLevel={setGradeLevel} />
                                </TableCell>

                                {/* Note */}
                                <TableCell className="whitespace-nowrap">
                                    <NotenInput grade={grade} type="note" setGradeField={setGradeField} />
                                </TableCell>

                                {/* ZAP */}
                                {mainSubjects.includes(grade.subject) && (
                                    <TableCell className="whitespace-nowrap">
                                        <NotenInput grade={grade} type="zap" setGradeField={setGradeField} />
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Status */}
            <dl className="w-full p-4 grid grid-cols-[max-content_1fr] gap-4 border border-gray-300 rounded">
                {gradeResponse?.status === false ? (
                    <>
                        <dt>Status:</dt>
                        <dd className="text-right text-destructive">{gradeResponse.error}</dd>
                    </>
                ) : (
                    <>
                        <dt>Bestanden:</dt>
                        <dd className="text-right font-bold">{gradeResponse?.passing ? 'Ja' : 'Nein'}</dd>
                        <dt>Notendurchschnitt:</dt>
                        <dd className="text-right font-bold">{gradeResponse?.average}</dd>
                    </>
                )}
            </dl>

            {/* Debug Button */}
            <div
                className="fixed top-0 left-0 text-transparent text-sm cursor-pointer"
                onClick={() => setGrades((prev) => prev.map((g) => ({ ...g, note: '1', zap: '1' })))}
            >
                Setall notes to 1
            </div>
        </div>
    );
}

export default App;

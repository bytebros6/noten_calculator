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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';

function App() {
    // Student storage context
    const { selectedStudent, setSelectedStudent, getGradesByStudent, setStudentGrades, storedStudents } =
        useStudentContext();

    // Grades of selected student
    const [grades, setGrades] = useState<GradeSubmission>(allSubjects.map((subject) => ({ subject } as Grade)));
    const [gradeResponse, setGradeResponse] = useState<GradeResponse>();
    const [selectedProjectSubject, setSelectedProjectSubject] = useState<Subject>('');

    // Save logic
    const [hasTriedToSave, setHasTriedToSave] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveToasts, setSaveToasts] = useState<string[]>([]);

    // Switch between 'E' and 'G'
    const setGradeLevel = (subject: Subject, newLevel: Level) => {
        setGrades((prev) => prev.map((g) => (g.subject === subject ? { ...g, level: newLevel } : g)));
    };

    // Set a grade field on a Grade: Note, Zap, Projekt
    const setGradeField = (subject: Subject, field: 'note' | 'zap' | 'projekt', value: string | undefined) => {
        setGrades((prev) =>
            prev.map((g) => {
                if (g.subject !== subject) return g;

                const updatedGrade = { ...g };
                if (value === undefined) {
                    delete updatedGrade[field];
                } else {
                    updatedGrade[field] = value as NoteString;
                }
                return updatedGrade;
            })
        );
    };

    // Store current student with their grades
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

    // Load student with their grades from storage
    const loadStudent = (name: string) => {
        setSelectedStudent(name);

        const loadedGrades = getGradesByStudent(name);
        if (loadedGrades.length > 0) {
            setGrades(loadedGrades);
        } else {
            setGrades(allSubjects.map((subject) => ({ subject } as Grade)));
        }

        const loadedProjectSubject = loadedGrades.find((g) => g.projekt);
        if (loadedProjectSubject) setSelectedProjectSubject(loadedProjectSubject.subject);
    };

    // Close all popups that come up on save student
    const closeAllSaveToasts = () => {
        saveToasts.forEach((id) => toast.dismiss(id));
        setSaveToasts([]);
    };

    // Choose a different subject of the project study
    const changeSelectedProjectSubject = (newSubject: Subject) => {
        setSelectedProjectSubject((prevSubject) => {
            const currentProjectGrade = grades.find((g) => g.projekt)?.projekt;
            if (currentProjectGrade) {
                setGradeField(newSubject, 'projekt', currentProjectGrade);
                setGradeField(prevSubject, 'projekt', undefined);
            }

            return newSubject;
        });
    };

    // Compute gradesResponse status again for new grades
    useEffect(() => {
        console.log('Grades', grades);

        setGradeResponse(computePassing(grades));
    }, [grades]);

    // On page load, load student grades if they exist in storage
    useEffect(() => {
        if (selectedStudent && storedStudents.includes(selectedStudent)) {
            loadStudent(selectedStudent);
        }
    }, []);

    return (
        <div className="w-[400px] flex flex-col items-center pt-10 pb-40 gap-4 mx-auto">
            <h1 className="mb-4 text-3xl font-semibold">Abinoten Rechner</h1>

            {/* Name Info + Save/Load */}
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

            {/* Input Table */}
            <div className="w-full border border-gray-300 rounded">
                <Table className="w-full text-sm">
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="font-bold">Fach</TableHead>
                            <TableHead className="font-bold w-10">E</TableHead>
                            <TableHead className="font-bold w-10">G</TableHead>
                            <TableHead className="font-bold">Note</TableHead>
                            <TableHead className="font-bold">ZAP</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Usual Grades (note & zap) */}
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

                        {/* Additional row for Projektarbeit */}
                        <TableRow className="w-full">
                            <TableCell colSpan={2} className="font-semibold">
                                Projektarbeit
                            </TableCell>
                            <TableCell colSpan={2}>
                                <Select
                                    value={selectedProjectSubject}
                                    onValueChange={(value: Subject) => changeSelectedProjectSubject(value)}
                                >
                                    <SelectTrigger className="h-8 w-full capitalize cursor-pointer">
                                        <SelectValue placeholder="Fach wählen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allSubjects.map((subject) => (
                                            <SelectItem
                                                key={subject}
                                                value={subject}
                                                className="capitalize cursor-pointer"
                                            >
                                                {subject}
                                            </SelectItem>
                                        ))}
                                        <SelectItem key="none" value="none" className="capitalize cursor-pointer">
                                            <em>Keine PA</em>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <NotenInput
                                    grade={grades.find((g) => g.subject === selectedProjectSubject)}
                                    type="projekt"
                                    setGradeField={setGradeField}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

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

import { useState } from 'react';
import { FolderDown, Trash2 } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStudentContext } from '@/contexts/StudentContext';

type Props = {
    onSelect: (name: string) => void;
};

export default function NamePickerDialog({ onSelect }: Props) {
    const { storedStudents, deleteStudent } = useStudentContext();

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <FolderDown /> Load
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Schüler auswählen</DialogTitle>
                </DialogHeader>

                {storedStudents.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {storedStudents
                            .sort((a, b) => a.localeCompare(b))
                            .map((student) => (
                                <li key={student} className="flex items-center justify-between py-2">
                                    <span>{student}</span>
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" onClick={() => deleteStudent(student)}>
                                            <Trash2 size={16} />
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                onSelect(student);
                                                setOpen(false);
                                            }}
                                        >
                                            Laden
                                        </Button>
                                    </div>
                                </li>
                            ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">Keine Schüler gespeichert.</p>
                )}

                <DialogFooter className="pt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Abbrechen
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

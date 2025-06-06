import { useState } from 'react';
import { FolderDown, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStudentContext } from '@/contexts/StudentContext';

type Props = {
    onOpen: () => void;
    onSelect: (name: string) => void;
};

export default function NamePickerDialog({ onSelect, onOpen }: Props) {
    const { storedStudents, deleteStudent } = useStudentContext();

    const [open, setOpen] = useState(false);

    const handleOpenClick = (isOpening: boolean) => {
        setOpen(isOpening);
        if (isOpening) onOpen();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenClick}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <FolderDown /> Load
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Schüler auswählen</DialogTitle>
                    <DialogDescription className="sr-only">
                        Wählen Sie einen Schüler aus der Liste aus.
                    </DialogDescription>
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

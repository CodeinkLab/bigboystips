"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { CheckCircleIcon, X } from "lucide-react";
import DynamicForm from "@/app/components/forms/DynamicForm";
import { predictionFormSchema } from "@/app/lib/formschemas/predictionForm";
import { CreatePredictionDTO } from "@/app/lib/interface";
import { useAuth } from "@/app/contexts/AuthContext";

export default function CreatePredictionClient() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    async function handleCreate(data: CreatePredictionDTO) {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/prediction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    publishedAt: new Date(data.publishedAt).toISOString(),
                    userId: user?.id,
                    odds: Number(data.odds),
                    result:"PENDING",
                }),
            });
            if (!response.ok) throw new Error("Failed to create prediction");
            toast.success("Prediction created successfully!", {
                duration: 5000,
                position: "top-center",
                icon: <CheckCircleIcon className="text-green-600" />,
            });
            router.push("/dashboard/predictions");
        } catch (error) {
            toast.error("Failed to create prediction. Please try again.", {
                duration: 10000,
                position: "top-center",
                icon: <X className="text-red-600" />,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DynamicForm
            schema={predictionFormSchema}
            onSubmit={handleCreate}
            submitLabel="Add Prediction"
            isSubmitting={isSubmitting}           
        />
    );
}

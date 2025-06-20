'use client';

import {
    useForm,
    UseFormRegister,
    FieldValues,
    FieldPath,
    DefaultValues,
    FieldErrors,
} from 'react-hook-form';
import { useState } from 'react';
import FormField, { FormFieldPropsWithChange } from './FormField';
import { DynamicFormProps } from '@/app/lib/interface';
import { use } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { sportTypeOptions } from '@/app/lib/formschemas/predictionForm';

export default function DynamicForm<TFieldValues extends FieldValues>({
    schema,
    onSubmit,
    initialData = {} as Partial<TFieldValues>,
    submitLabel = 'Submit',
    className = 'max-w-2xl mx-auto py-4',
    isSubmitting = false,
    onCancel,
    cancelLabel = 'Cancel',
}: DynamicFormProps<TFieldValues>) {
    const { user } = useAuth()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TFieldValues>({
        defaultValues: initialData as DefaultValues<TFieldValues>,
    });

    const [selectedSportType, setSelectedSportType] = useState<string>(initialData['sporttype'] || '');
    const [leagueOptions, setLeagueOptions] = useState(() => {
        if (initialData['sporttype']) {
            const found = sportTypeOptions.find(opt => opt.label === initialData['sporttype']);
            return found ? found.league : [];
        }
        return [];
    });

    const handleSportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedSportType(value);
        const found = sportTypeOptions.find(opt => opt.label === value);
        setLeagueOptions(found ? found.league : []);
    };

    const handleFormSubmit = handleSubmit((data: TFieldValues) => {
        data = {
            ...data,
            userId: user?.id || '',
            publishedAt: new Date(data.publishedAt).toISOString(),
        }
        console.log('Form submitted with data:', data);
        return onSubmit(data);
    });

    return (
        <form onSubmit={handleFormSubmit} className={`space-y-6 ${className}`}>
            {Object.entries(schema).map(([name, field]) => {
                if (field.hidden) return null;

                const fieldName = name as FieldPath<TFieldValues>;
                const error = errors[fieldName] as FieldErrors | undefined;

                // For sporttype and league, inject onChange and options
                if (name === 'sporttype') {
                    return (
                        <FormField
                            key={name}
                            name={name}
                            label={field.label}
                            type={field.type}
                            register={register as UseFormRegister<FieldValues>}
                            error={error}
                            required={field.required}
                            options={sportTypeOptions.map(opt => ({ label: opt.label, value: opt.label }))}
                            disabled={field.disabled || isSubmitting}
                            placeholder={field.placeholder}
                            onChange={handleSportTypeChange}
                        />
                    );
                }
                if (name === 'league') {
                    return (
                        <FormField
                            key={name}
                            name={name}
                            label={field.label}
                            type={field.type}
                            register={register as UseFormRegister<FieldValues>}
                            error={error}
                            required={field.required}
                            options={leagueOptions.length > 0 ? leagueOptions : field.options}
                            disabled={field.disabled || isSubmitting}
                            placeholder={field.placeholder}
                        />
                    );
                }

                return (
                    <FormField
                        key={name}
                        name={name}
                        label={field.label}
                        type={field.type}
                        register={register as UseFormRegister<FieldValues>}
                        error={error}
                        required={field.required}
                        options={field.options}
                        disabled={field.disabled || isSubmitting}
                        placeholder={field.placeholder}
                    />
                );
            })}

            <div className="flex justify-end space-x-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                    >
                        {cancelLabel}
                    </button>
                )}
                <button
                    type="submit"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <svg
                                className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Processing...
                        </>
                    ) : (
                        submitLabel
                    )}
                </button>
            </div>
        </form>
    );
}

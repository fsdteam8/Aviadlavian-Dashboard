"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CSVFileModal from "./CSVFileModal";
import { useCreateInjury } from "../hooks/useCreateInjury";
import { Loader2 } from "lucide-react";

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddTopicModal: React.FC<AddTopicModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const createInjuryMutation = useCreateInjury();

  const [formData, setFormData] = useState({
    Id: "",
    Name: "",
    Primary_Body_Region: "",
    Secondary_Body_Region: "",
    Acuity: "",
    Age_Group: "",
    Tissue_Type: "",
    Etiology_Mechanism: "",
    Common_Sports: "",
    Synonyms_Abbreviations: "",
    Importance_Level: "",
    Description: "",
    Tags_Keywords: "",
    Video_URL: null as File | null,
    Image_URL: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Log the form data for debugging
    console.log("Submitting form data:", formData);

    createInjuryMutation.mutate(formData, {
      onSuccess: () => {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          Id: "",
          Name: "",
          Primary_Body_Region: "",
          Secondary_Body_Region: "",
          Acuity: "",
          Age_Group: "",
          Tissue_Type: "",
          Etiology_Mechanism: "",
          Common_Sports: "",
          Synonyms_Abbreviations: "",
          Importance_Level: "",
          Description: "",
          Tags_Keywords: "",
          Video_URL: null,
          Image_URL: null,
        });
      },
      onError: (error) => {
        console.error("Mutation error:", error);

        const apiError = error as {
          response?: {
            data?: {
              data?: Array<{
                field?: string;
                message?: string;
              }>;
              message?: string;
            };
          };
        };

        const validationErrors = apiError.response?.data?.data;

        if (validationErrors && validationErrors.length > 0) {
          const errorMessages = validationErrors
            .map(
              (err) =>
                `${err.field || "field"}: ${err.message || "Invalid value"}`,
            )
            .join("\n");
          alert(`Validation failed:\n${errorMessages}`);
          return;
        }

        alert(apiError.response?.data?.message || "Failed to create topic");
      },
    });
  };

  const handleOpenCSVModal = () => {
    setIsCSVModalOpen(true);
  };

  const handleCSVSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Add Topic
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Topic ID */}
              <div>
                <Label className="mb-2" htmlFor="Id">
                  Topic ID
                </Label>
                <Input
                  id="Id"
                  name="Id"
                  placeholder="Give Topic ID"
                  value={formData.Id}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Topic Name */}
              <div>
                <Label className="mb-2" htmlFor="Name">
                  Topic Name
                </Label>
                <Input
                  id="Name"
                  name="Name"
                  placeholder="Give Topic Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Primary Body Region */}
              <div>
                <Label className="mb-2" htmlFor="Primary_Body_Region">
                  Primary Body Region
                </Label>
                <Input
                  id="Primary_Body_Region"
                  name="Primary_Body_Region"
                  placeholder="primary_body_region"
                  value={formData.Primary_Body_Region}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Secondary Body Region */}
              <div>
                <Label className="mb-2" htmlFor="Secondary_Body_Region">
                  Secondary Body Region
                </Label>
                <Input
                  id="Secondary_Body_Region"
                  name="Secondary_Body_Region"
                  placeholder="secondary_body_region"
                  value={formData.Secondary_Body_Region}
                  onChange={handleInputChange}
                />
              </div>

              {/* Acuity */}
              <div>
                <Label className="mb-2" htmlFor="Acuity">
                  Acuity
                </Label>
                <Input
                  id="Acuity"
                  name="Acuity"
                  placeholder="acuity"
                  value={formData.Acuity}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Age Group */}
              <div>
                <Label className="mb-2" htmlFor="Age_Group">
                  Age Group
                </Label>
                <Input
                  id="Age_Group"
                  name="Age_Group"
                  placeholder="age_group"
                  value={formData.Age_Group}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Tissue Type */}
              <div>
                <Label className="mb-2" htmlFor="Tissue_Type">
                  Tissue Type
                </Label>
                <Input
                  id="Tissue_Type"
                  name="Tissue_Type"
                  placeholder="tissue_type"
                  value={formData.Tissue_Type}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Etiology Mechanism */}
              <div>
                <Label className="mb-2" htmlFor="Etiology_Mechanism">
                  Etiology Mechanism
                </Label>
                <Input
                  id="Etiology_Mechanism"
                  name="Etiology_Mechanism"
                  placeholder="etiology_mechanism"
                  value={formData.Etiology_Mechanism}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Common Sports */}
              <div>
                <Label className="mb-2" htmlFor="Common_Sports">
                  Common Sports
                </Label>
                <Input
                  id="Common_Sports"
                  name="Common_Sports"
                  placeholder="common_sports"
                  value={formData.Common_Sports}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Synonyms Abbreviations */}
              <div>
                <Label className="mb-2" htmlFor="Synonyms_Abbreviations">
                  Synonyms Abbreviations
                </Label>
                <Input
                  id="Synonyms_Abbreviations"
                  name="Synonyms_Abbreviations"
                  placeholder="synonyms_abbreviations"
                  value={formData.Synonyms_Abbreviations}
                  onChange={handleInputChange}
                />
              </div>

              {/* Importance Level */}
              <div>
                <Label className="mb-2" htmlFor="Importance_Level">
                  Importance level
                </Label>
                <Input
                  id="Importance_Level"
                  name="Importance_Level"
                  placeholder="importance_level"
                  value={formData.Importance_Level}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Tags Keywords */}
              <div>
                <Label className="mb-2" htmlFor="Tags_Keywords">
                  Tags Keywords
                </Label>
                <Input
                  id="Tags_Keywords"
                  name="Tags_Keywords"
                  placeholder="tags_keywords"
                  value={formData.Tags_Keywords}
                  onChange={handleInputChange}
                />
              </div>

              {/* Description - Full Width */}
              <div className="md:col-span-2">
                <Label className="mb-2" htmlFor="Description">
                  Description
                </Label>
                <Textarea
                  id="Description"
                  name="Description"
                  placeholder="description"
                  value={formData.Description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              {/* Video URL - File */}
              <div>
                <Label className="mb-2" htmlFor="Video_URL">
                  Video URL
                </Label>
                <Input
                  id="Video_URL"
                  name="Video_URL"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                />
              </div>

              {/* Image URL - File */}
              <div>
                <Label className="mb-2" htmlFor="Image_URL">
                  Image URL
                </Label>
                <Input
                  id="Image_URL"
                  name="Image_URL"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* CSV Upload Option */}
            <div className="text-center py-2">
              <button
                type="button"
                onClick={handleOpenCSVModal}
                className="text-teal-500 hover:text-teal-600 font-medium"
              >
                or Upload <span className="font-bold">CSV</span>
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={createInjuryMutation.isPending}
                className="bg-teal-500 hover:bg-teal-600 text-white px-8"
              >
                {createInjuryMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "+Add Topic"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <CSVFileModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onSuccess={handleCSVSuccess}
      />
    </>
  );
};

export default AddTopicModal;

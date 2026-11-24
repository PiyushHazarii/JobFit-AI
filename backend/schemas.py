from typing import List, Optional
from pydantic import BaseModel, Field

class ExperienceAnalysis(BaseModel):
    is_requirement_met: bool = Field(
        description="Whether the candidate meets the minimum experience requirement specified in the job description"
    )
    candidate_years: Optional[float] = Field(
        default=None,
        description="Estimated years of relevant experience detected in the candidate's resume"
    )
    required_years: Optional[float] = Field(
        default=None,
        description="Minimum years of experience required by the job description, or null if not specified"
    )
    details: str = Field(
        description="Clear explanation comparing candidate experience with job expectations"
    )

class JobFitAnalysis(BaseModel):
    candidate_name: Optional[str] = Field(
        default="Candidate",
        description="Name of the candidate extracted from the resume"
    )
    score: float = Field(
        description="Overall job fit score out of 10 (e.g. 8.5, 7.0, 4.5)"
    )
    match_percentage: int = Field(
        description="Overall match percentage from 0 to 100%"
    )
    verdict: str = Field(
        description="Short, impactful verdict (e.g., 'Strong Match', 'Moderate Fit', 'Requires Improvement')"
    )
    summary: str = Field(
        description="Concise 2-3 sentence overview of how well the candidate fits the role"
    )
    matching_skills: List[str] = Field(
        default_factory=list,
        description="Key skills and qualifications found in both the resume and job description"
    )
    missing_keywords: List[str] = Field(
        default_factory=list,
        description="Important keywords, tools, or requirements from the job description missing from the resume"
    )
    experience_analysis: ExperienceAnalysis = Field(
        description="Detailed breakdown of candidate experience vs job requirements"
    )
    key_strengths: List[str] = Field(
        default_factory=list,
        description="Top strengths and highlights from the candidate's resume for this role"
    )
    suggestions_for_resume: List[str] = Field(
        default_factory=list,
        description="Actionable, bullet-point advice on what exact edits or additions to make to improve the resume for this job"
    )

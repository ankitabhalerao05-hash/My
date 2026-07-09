import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_absolute_error, r2_score, classification_report
import joblib

# Set random seed for reproducibility
np.random.seed(42)

# Define career paths and their key technical skills
CAREER_PATHS = {
    "Software Engineer": ["Python", "Java", "C++", "HTML_CSS", "JavaScript", "Git_GitHub"],
    "Data Scientist": ["Python", "SQL", "Machine_Learning", "Data_Analysis", "Git_GitHub"],
    "UX/UI Designer": ["HTML_CSS", "Figma", "UI_UX_Design"],
    "DevOps Engineer": ["Docker_Kubernetes", "Cloud_Computing", "Git_GitHub"],
    "Product Manager": ["Agile_Scrum", "UI_UX_Design", "Data_Analysis"],
    "Marketing Specialist": ["SEO_Marketing", "Data_Analysis", "HTML_CSS"]
}

ALL_TECH_SKILLS = [
    "Python", "Java", "C++", "HTML_CSS", "JavaScript", "SQL", 
    "Machine_Learning", "Data_Analysis", "Figma", "UI_UX_Design", 
    "Docker_Kubernetes", "Cloud_Computing", "Git_GitHub", "Agile_Scrum", 
    "SEO_Marketing"
]

MAJORS = [
    "Computer Science", "Data Science", "Information Technology", 
    "Business Administration", "Graphic Design", "Marketing", 
    "Mechanical Engineering", "Other"
]

DEGREES = ["B.S.", "M.S.", "B.A.", "B.B.A.", "Ph.D."]

def generate_synthetic_data(num_samples=5000):
    data = []
    
    for _ in range(num_samples):
        # 1. Select a random target career path to guide the feature generation
        target_path = np.random.choice(list(CAREER_PATHS.keys()))
        
        # 2. Assign major and degree based on target path (with some randomness)
        if target_path in ["Software Engineer", "Data Scientist", "DevOps Engineer"]:
            major = np.random.choice(["Computer Science", "Data Science", "Information Technology", "Other"], p=[0.6, 0.2, 0.15, 0.05])
            degree = np.random.choice(DEGREES, p=[0.7, 0.2, 0.02, 0.01, 0.07])
        elif target_path == "UX/UI Designer":
            major = np.random.choice(["Graphic Design", "Computer Science", "Other"], p=[0.7, 0.15, 0.15])
            degree = np.random.choice(DEGREES, p=[0.75, 0.15, 0.05, 0.02, 0.03])
        elif target_path == "Product Manager":
            major = np.random.choice(["Business Administration", "Computer Science", "Information Technology", "Other"], p=[0.5, 0.2, 0.2, 0.1])
            degree = np.random.choice(DEGREES, p=[0.5, 0.3, 0.05, 0.1, 0.05])
        else:  # Marketing Specialist
            major = np.random.choice(["Marketing", "Business Administration", "Other"], p=[0.6, 0.3, 0.1])
            degree = np.random.choice(DEGREES, p=[0.7, 0.15, 0.05, 0.08, 0.02])
            
        # 3. Academic performance (GPA)
        # Higher GPAs are slightly more common in M.S./Ph.D.
        gpa_mean = 3.4 if degree in ["M.S.", "Ph.D."] else 3.1
        gpa = np.clip(np.random.normal(gpa_mean, 0.4), 2.0, 4.0)
        
        # 4. Generate technical skills
        # Candidate has a higher probability of having skills required for their target path
        skills_profile = {}
        for skill in ALL_TECH_SKILLS:
            if skill in CAREER_PATHS[target_path]:
                prob = 0.85  # High chance of having target path skills
            else:
                prob = 0.20  # Lower chance of having other skills
            skills_profile[skill] = int(np.random.random() < prob)
            
        # 5. Soft Skills (scale 1-10)
        # Some roles value specific soft skills slightly differently, but we generate them normally
        comm_skill = np.clip(np.random.normal(7.0, 1.5), 1.0, 10.0)
        problem_solving = np.clip(np.random.normal(7.0, 1.5), 1.0, 10.0)
        teamwork = np.clip(np.random.normal(7.5, 1.2), 1.0, 10.0)
        leadership = np.clip(np.random.normal(6.0, 1.8), 1.0, 10.0)
        
        # 6. Experience and activities
        projects_count = int(np.clip(np.random.poisson(3), 0, 8))
        internships_count = int(np.random.choice([0, 1, 2, 3], p=[0.4, 0.4, 0.15, 0.05]))
        certifications_count = int(np.clip(np.random.poisson(1.5), 0, 5))
        extracurricular_score = np.clip(np.random.normal(6.5, 1.5), 1.0, 10.0)
        work_experience_months = int(np.clip(np.random.exponential(8), 0, 48))
        
        # Calculate Employability Score (0-100) based on features
        # We define a logical formula and add some noise
        score = 35.0  # Base score
        
        # Academic component (max 15 points)
        score += (gpa - 2.0) * 7.5
        
        # Skills component (max 20 points)
        # Count how many of the target path's required skills the candidate has
        target_skills_had = sum(skills_profile[s] for s in CAREER_PATHS[target_path])
        max_target_skills = len(CAREER_PATHS[target_path])
        score += (target_skills_had / max_target_skills) * 12.0
        # Add a bit for general technical skill variety (max 8 points)
        total_skills = sum(skills_profile.values())
        score += min(total_skills * 0.8, 8.0)
        
        # Soft skills component (max 15 points)
        avg_soft_skill = (comm_skill + problem_solving + teamwork + leadership) / 4.0
        score += (avg_soft_skill - 1.0) * 1.67  # scale 1-10 to 0-15
        
        # Experience component (max 35 points)
        score += min(projects_count * 2.5, 10.0)
        score += min(internships_count * 6.0, 12.0)
        score += min(work_experience_months * 0.25, 8.0)
        score += min(certifications_count * 1.5, 5.0)
        
        # Extracurricular component (max 5 points)
        score += (extracurricular_score - 1.0) * 0.55
        
        # Cap score before noise
        score = np.clip(score, 10.0, 100.0)
        
        # Add Gaussian noise
        noise = np.random.normal(0, 2.5)
        score = np.clip(score + noise, 0.0, 100.0)
        
        # Record the sample
        row = {
            "degree": degree,
            "major": major,
            "gpa": round(gpa, 2),
            **skills_profile,
            "communication": round(comm_skill, 1),
            "problem_solving": round(problem_solving, 1),
            "teamwork": round(teamwork, 1),
            "leadership": round(leadership, 1),
            "projects_count": projects_count,
            "internships_count": internships_count,
            "certifications_count": certifications_count,
            "work_experience_months": work_experience_months,
            "extracurricular_score": round(extracurricular_score, 1),
            "employability_score": round(score, 1),
            "recommended_career_path": target_path
        }
        data.append(row)
        
    return pd.DataFrame(data)

def train_and_save_models():
    print("Generating synthetic candidate data...")
    df = generate_synthetic_data(6000)
    
    # Define features and targets
    categorical_features = ["degree", "major"]
    numeric_features = ["gpa"] + ALL_TECH_SKILLS + ["communication", "problem_solving", "teamwork", "leadership", 
                                                    "projects_count", "internships_count", "certifications_count", 
                                                    "work_experience_months", "extracurricular_score"]
    
    X = df[categorical_features + numeric_features]
    y_reg = df["employability_score"]
    y_clf = df["recommended_career_path"]
    
    # Split data
    X_train, X_test, y_reg_train, y_reg_test, y_clf_train, y_clf_test = train_test_split(
        X, y_reg, y_clf, test_size=0.2, random_state=42
    )
    
    # Define preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
            ("num", StandardScaler(), numeric_features)
        ]
    )
    
    # 1. Train Employability Score Regressor
    print("Training Employability Score Regressor...")
    reg_pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("regressor", RandomForestRegressor(n_estimators=150, max_depth=12, random_state=42))
    ])
    reg_pipeline.fit(X_train, y_reg_train)
    
    # Evaluate Regressor
    y_reg_pred = reg_pipeline.predict(X_test)
    mae = mean_absolute_error(y_reg_test, y_reg_pred)
    r2 = r2_score(y_reg_test, y_reg_pred)
    print(f"Regressor Evaluation - MAE: {mae:.2f}, R² Score: {r2:.4f}")
    
    # 2. Train Career Path Classifier
    print("Training Career Path Classifier...")
    clf_pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42))
    ])
    clf_pipeline.fit(X_train, y_clf_train)
    
    # Evaluate Classifier
    y_clf_pred = clf_pipeline.predict(X_test)
    print("Classifier Evaluation:")
    print(classification_report(y_clf_test, y_clf_pred))
    
    # Save the models and metadata
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)
    
    model_data = {
        "reg_pipeline": reg_pipeline,
        "clf_pipeline": clf_pipeline,
        "all_tech_skills": ALL_TECH_SKILLS,
        "career_paths": CAREER_PATHS,
        "categorical_features": categorical_features,
        "numeric_features": numeric_features
    }
    
    model_path = os.path.join(models_dir, "career_models.joblib")
    joblib.dump(model_data, model_path)
    print(f"Models successfully saved to {model_path}")
    
    # Export a small sample of data for reference/testing
    sample_path = os.path.join(models_dir, "sample_data.csv")
    df.head(10).to_csv(sample_path, index=False)
    print(f"Sample data saved to {sample_path}")

if __name__ == "__main__":
    train_and_save_models()

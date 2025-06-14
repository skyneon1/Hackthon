import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const ToolsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 4rem;
  
  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 1rem;
    letter-spacing: -1px;
  }
  
  p {
    font-size: 1.2rem;
    color: #7f8c8d;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const ToolCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
`;

const ToolHeader = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const ToolContent = styled.div`
  padding: 2rem;
`;

const BMICalculator = styled.div`
  .input-group {
    margin-bottom: 1.5rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      
      &:focus {
        outline: none;
        border-color: #2c3e50;
      }
    }
  }
  
  .result {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    text-align: center;
    
    h4 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .bmi-value {
      font-size: 2rem;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .bmi-category {
      font-size: 1.1rem;
      color: #7f8c8d;
    }
  }
`;

const CalorieCalculator = styled.div`
  .input-group {
    margin-bottom: 1.5rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 500;
    }
    
    select, input {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      
      &:focus {
        outline: none;
        border-color: #2c3e50;
      }
    }
  }
  
  .result {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    
    h4 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    
    .calorie-value {
      font-size: 2rem;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    
    .macros {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      
      .macro {
        text-align: center;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        
        h5 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        
        p {
          color: #7f8c8d;
          font-size: 0.9rem;
        }
      }
    }
  }
`;

const WaterIntakeCalculator = styled.div`
  .input-group {
    margin-bottom: 1.5rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      
      &:focus {
        outline: none;
        border-color: #2c3e50;
      }
    }
  }
  
  .result {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    text-align: center;
    
    h4 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .water-value {
      font-size: 2rem;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .water-tips {
      margin-top: 1rem;
      text-align: left;
      
      li {
        color: #7f8c8d;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      }
    }
  }
`;

const Tools = () => {
  const [bmiData, setBmiData] = useState({
    height: '',
    weight: '',
    bmi: null,
    category: ''
  });

  const [calorieData, setCalorieData] = useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    activity: 'sedentary',
    calories: null,
    macros: {
      protein: 0,
      carbs: 0,
      fat: 0
    }
  });

  const [waterData, setWaterData] = useState({
    weight: '',
    water: null
  });

  const calculateBMI = () => {
    const height = parseFloat(bmiData.height) / 100; // Convert cm to m
    const weight = parseFloat(bmiData.weight);
    
    if (height && weight) {
      const bmi = weight / (height * height);
      let category = '';
      
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 25) category = 'Normal weight';
      else if (bmi < 30) category = 'Overweight';
      else category = 'Obesity';
      
      setBmiData(prev => ({
        ...prev,
        bmi: bmi.toFixed(1),
        category
      }));
    }
  };

  const calculateCalories = () => {
    const { age, gender, height, weight, activity } = calorieData;
    
    if (age && height && weight) {
      let bmr;
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
      
      let activityMultiplier = 1.2;
      if (activity === 'light') activityMultiplier = 1.375;
      else if (activity === 'moderate') activityMultiplier = 1.55;
      else if (activity === 'active') activityMultiplier = 1.725;
      else if (activity === 'very_active') activityMultiplier = 1.9;
      
      const calories = Math.round(bmr * activityMultiplier);
      const protein = Math.round(calories * 0.3 / 4);
      const carbs = Math.round(calories * 0.4 / 4);
      const fat = Math.round(calories * 0.3 / 9);
      
      setCalorieData(prev => ({
        ...prev,
        calories,
        macros: { protein, carbs, fat }
      }));
    }
  };

  const calculateWater = () => {
    const weight = parseFloat(waterData.weight);
    
    if (weight) {
      const water = Math.round(weight * 0.033);
      setWaterData(prev => ({
        ...prev,
        water
      }));
    }
  };

  return (
    <ToolsContainer>
      <Header>
        <h1>Health Tools</h1>
        <p>Use our interactive tools to track and improve your health and wellness</p>
      </Header>

      <ToolsGrid>
        <ToolCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ToolHeader>
            <h3>BMI Calculator</h3>
            <p>Calculate your Body Mass Index and understand your weight category</p>
          </ToolHeader>
          <ToolContent>
            <BMICalculator>
              <div className="input-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  value={bmiData.height}
                  onChange={(e) => setBmiData(prev => ({ ...prev, height: e.target.value }))}
                  onBlur={calculateBMI}
                />
              </div>
              <div className="input-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  value={bmiData.weight}
                  onChange={(e) => setBmiData(prev => ({ ...prev, weight: e.target.value }))}
                  onBlur={calculateBMI}
                />
              </div>
              {bmiData.bmi && (
                <div className="result">
                  <h4>Your BMI</h4>
                  <div className="bmi-value">{bmiData.bmi}</div>
                  <div className="bmi-category">{bmiData.category}</div>
                </div>
              )}
            </BMICalculator>
          </ToolContent>
        </ToolCard>

        <ToolCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ToolHeader>
            <h3>Calorie Calculator</h3>
            <p>Calculate your daily calorie needs and macronutrient distribution</p>
          </ToolHeader>
          <ToolContent>
            <CalorieCalculator>
              <div className="input-group">
                <label>Age</label>
                <input
                  type="number"
                  value={calorieData.age}
                  onChange={(e) => setCalorieData(prev => ({ ...prev, age: e.target.value }))}
                  onBlur={calculateCalories}
                />
              </div>
              <div className="input-group">
                <label>Gender</label>
                <select
                  value={calorieData.gender}
                  onChange={(e) => setCalorieData(prev => ({ ...prev, gender: e.target.value }))}
                  onBlur={calculateCalories}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="input-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  value={calorieData.height}
                  onChange={(e) => setCalorieData(prev => ({ ...prev, height: e.target.value }))}
                  onBlur={calculateCalories}
                />
              </div>
              <div className="input-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  value={calorieData.weight}
                  onChange={(e) => setCalorieData(prev => ({ ...prev, weight: e.target.value }))}
                  onBlur={calculateCalories}
                />
              </div>
              <div className="input-group">
                <label>Activity Level</label>
                <select
                  value={calorieData.activity}
                  onChange={(e) => setCalorieData(prev => ({ ...prev, activity: e.target.value }))}
                  onBlur={calculateCalories}
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Lightly Active</option>
                  <option value="moderate">Moderately Active</option>
                  <option value="active">Very Active</option>
                  <option value="very_active">Extra Active</option>
                </select>
              </div>
              {calorieData.calories && (
                <div className="result">
                  <h4>Daily Calorie Needs</h4>
                  <div className="calorie-value">{calorieData.calories} kcal</div>
                  <div className="macros">
                    <div className="macro">
                      <h5>Protein</h5>
                      <p>{calorieData.macros.protein}g</p>
                    </div>
                    <div className="macro">
                      <h5>Carbs</h5>
                      <p>{calorieData.macros.carbs}g</p>
                    </div>
                    <div className="macro">
                      <h5>Fat</h5>
                      <p>{calorieData.macros.fat}g</p>
                    </div>
                  </div>
                </div>
              )}
            </CalorieCalculator>
          </ToolContent>
        </ToolCard>

        <ToolCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <ToolHeader>
            <h3>Water Intake Calculator</h3>
            <p>Calculate your daily water intake needs</p>
          </ToolHeader>
          <ToolContent>
            <WaterIntakeCalculator>
              <div className="input-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  value={waterData.weight}
                  onChange={(e) => setWaterData(prev => ({ ...prev, weight: e.target.value }))}
                  onBlur={calculateWater}
                />
              </div>
              {waterData.water && (
                <div className="result">
                  <h4>Daily Water Intake</h4>
                  <div className="water-value">{waterData.water} liters</div>
                  <ul className="water-tips">
                    <li>Drink water throughout the day, not all at once</li>
                    <li>Increase intake during exercise or hot weather</li>
                    <li>Listen to your body's thirst signals</li>
                    <li>Include water-rich foods in your diet</li>
                  </ul>
                </div>
              )}
            </WaterIntakeCalculator>
          </ToolContent>
        </ToolCard>
      </ToolsGrid>
    </ToolsContainer>
  );
};

export default Tools; 
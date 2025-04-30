import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import styled from "styled-components";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Grid,
  Slider,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantIcon from "@mui/icons-material/Restaurant";

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  portions: number;
}

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
`;

const StyledCard = styled(Card)`
  && {
    margin: 1rem;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
    }
  }
`;

const StyledButton = styled(Button)`
  && {
    margin: 0.5rem;
    background: linear-gradient(45deg, #2196F3 30%, #21CBF3 90%);
    border: 0;
    color: white;
    box-shadow: 0 3px 5px 2px rgba(33, 203, 243, .3);
  }
`;

const Title = styled(Typography)`
  && {
    color: #2c3e50;
    text-align: center;
    margin-bottom: 2rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }
`;

function App() {
  const [recipes, setRecipes] = useLocalStorageState<Recipe[]>("recipes", {
    defaultValue: [],
  });
  const [newRecipe, setNewRecipe] = useState<Omit<Recipe, 'id'>>({
    name: "",
    description: "",
    ingredients: [{ name: "", amount: 0, unit: "" }],
    instructions: [""],
    portions: 1,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (recipes.length === 0) {
      const boilerplateRecipes: Recipe[] = [
        {
          id: 1,
          name: "Паста Карбонара",
          description: "Классическая итальянская паста с беконом и яйцами",
          ingredients: [
            { name: "Спагетти", amount: 200, unit: "г" },
            { name: "Бекон", amount: 100, unit: "г" },
            { name: "Яйца", amount: 2, unit: "шт" },
            { name: "Пармезан", amount: 50, unit: "г" },
          ],
          instructions: [
            "Отварить пасту",
            "Обжарить бекон",
            "Смешать яйца с сыром",
            "Соединить все ингредиенты",
          ],
          portions: 2,
        },
        {
          id: 2,
          name: "Омлет",
          description: "Простой и вкусный завтрак",
          ingredients: [
            { name: "Яйца", amount: 3, unit: "шт" },
            { name: "Молоко", amount: 50, unit: "мл" },
            { name: "Соль", amount: 1, unit: "щепотка" },
          ],
          instructions: [
            "Взбить яйца с молоком",
            "Добавить соль",
            "Жарить на сковороде",
          ],
          portions: 1,
        },
        {
          id: 3,
          name: "Салат Цезарь",
          description: "Классический салат с курицей и сухариками",
          ingredients: [
            { name: "Куриная грудка", amount: 200, unit: "г" },
            { name: "Листья салата", amount: 100, unit: "г" },
            { name: "Сухарики", amount: 50, unit: "г" },
            { name: "Пармезан", amount: 30, unit: "г" },
          ],
          instructions: [
            "Обжарить курицу",
            "Порвать салат",
            "Смешать все ингредиенты",
            "Добавить соус",
          ],
          portions: 2,
        },
        {
          id: 4,
          name: "Борщ",
          description: "Традиционный украинский суп",
          ingredients: [
            { name: "Свекла", amount: 2, unit: "шт" },
            { name: "Картофель", amount: 3, unit: "шт" },
            { name: "Капуста", amount: 200, unit: "г" },
            { name: "Мясо", amount: 300, unit: "г" },
          ],
          instructions: [
            "Сварить бульон",
            "Добавить овощи",
            "Варить до готовности",
            "Добавить зелень",
          ],
          portions: 4,
        },
        {
          id: 5,
          name: "Шоколадный торт",
          description: "Нежный шоколадный десерт",
          ingredients: [
            { name: "Мука", amount: 200, unit: "г" },
            { name: "Сахар", amount: 200, unit: "г" },
            { name: "Какао", amount: 50, unit: "г" },
            { name: "Яйца", amount: 4, unit: "шт" },
          ],
          instructions: [
            "Смешать сухие ингредиенты",
            "Добавить яйца",
            "Выпекать 30 минут",
            "Украсить кремом",
          ],
          portions: 8,
        },
      ];
      setRecipes(boilerplateRecipes);
    }
  }, [recipes, setRecipes]);

  const handleAddRecipe = () => {
    if (newRecipe.name && newRecipe.description) {
      const recipe: Recipe = {
        id: Date.now(),
        ...newRecipe
      };
      setRecipes([...recipes, recipe]);
      setNewRecipe({
        name: "",
        description: "",
        ingredients: [{ name: "", amount: 0, unit: "" }],
        instructions: [""],
        portions: 1,
      });
    }
  };

  const handleDeleteRecipe = (id: number) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  const handleEditRecipe = (id: number) => {
    setEditingId(id);
    const recipeToEdit = recipes.find((recipe) => recipe.id === id);
    if (recipeToEdit) {
      setNewRecipe(recipeToEdit);
    }
  };

  const handleUpdateRecipe = (id: number) => {
    if (newRecipe.name && newRecipe.description) {
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === id
            ? {
              ...recipe,
              name: newRecipe.name,
              description: newRecipe.description,
              ingredients: newRecipe.ingredients || [],
              instructions: newRecipe.instructions || [],
              portions: newRecipe.portions || 1,
            }
            : recipe
        )
      );
      setEditingId(null);
      setNewRecipe({
        name: "",
        description: "",
        ingredients: [{ name: "", amount: 0, unit: "" }],
        instructions: [""],
        portions: 1,
      });
    }
  };

  const handlePortionChange = (id: number, newPortions: number) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === id
          ? {
            ...recipe,
            portions: newPortions,
            ingredients: recipe.ingredients.map((ingredient) => ({
              ...ingredient,
              amount: (ingredient.amount * newPortions) / recipe.portions,
            })),
          }
          : recipe
      )
    );
  };

  return (
    <AppContainer>
      <Typography variant="h3" sx={{ textAlign: 'center', mb: 2 }}>
        <RestaurantIcon sx={{ fontSize: 40, mr: 1 }} />
        Моя Кулинарная Книга
      </Typography>

      <Card sx={{ mb: 4, p: 2, background: 'rgba(255, 255, 255, 0.9)' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Добавить новый рецепт</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название блюда"
                value={newRecipe.name}
                onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание"
                multiline
                rows={2}
                value={newRecipe.description}
                onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Ингредиенты:</Typography>
              {newRecipe.ingredients.map((ingredient, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Название"
                      value={ingredient.name}
                      onChange={(e) => {
                        const newIngredients = [...newRecipe.ingredients];
                        newIngredients[index] = { ...ingredient, name: e.target.value };
                        setNewRecipe({ ...newRecipe, ingredients: newIngredients });
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Количество"
                      type="number"
                      value={ingredient.amount}
                      onChange={(e) => {
                        const newIngredients = [...newRecipe.ingredients];
                        newIngredients[index] = { ...ingredient, amount: Number(e.target.value) };
                        setNewRecipe({ ...newRecipe, ingredients: newIngredients });
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Единица измерения"
                      value={ingredient.unit}
                      onChange={(e) => {
                        const newIngredients = [...newRecipe.ingredients];
                        newIngredients[index] = { ...ingredient, unit: e.target.value };
                        setNewRecipe({ ...newRecipe, ingredients: newIngredients });
                      }}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      onClick={() => {
                        const newIngredients = newRecipe.ingredients.filter((_, i) => i !== index);
                        setNewRecipe({ ...newRecipe, ingredients: newIngredients });
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                onClick={() => {
                  setNewRecipe({
                    ...newRecipe,
                    ingredients: [...newRecipe.ingredients, { name: "", amount: 0, unit: "" }],
                  });
                }}
                sx={{ mt: 1 }}
              >
                Добавить ингредиент
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Инструкции:</Typography>
              {newRecipe.instructions.map((instruction, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                  <Grid item xs={11}>
                    <TextField
                      fullWidth
                      label={`Шаг ${index + 1}`}
                      value={instruction}
                      onChange={(e) => {
                        const newInstructions = [...newRecipe.instructions];
                        newInstructions[index] = e.target.value;
                        setNewRecipe({ ...newRecipe, instructions: newInstructions });
                      }}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      onClick={() => {
                        const newInstructions = newRecipe.instructions.filter((_, i) => i !== index);
                        setNewRecipe({ ...newRecipe, instructions: newInstructions });
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                onClick={() => {
                  setNewRecipe({
                    ...newRecipe,
                    instructions: [...newRecipe.instructions, ""],
                  });
                }}
                sx={{ mt: 1 }}
              >
                Добавить шаг
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddRecipe}
                  disabled={!newRecipe.name || !newRecipe.description}
                >
                  Добавить рецепт
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {recipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <StyledCard>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {recipe.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {recipe.description}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Ингредиенты:
                </Typography>
                <List>
                  {recipe.ingredients.map((ingredient, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${ingredient.name}: ${ingredient.amount} ${ingredient.unit}`}
                      />
                    </ListItem>
                  ))}
                </List>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Инструкции:
                </Typography>
                <List>
                  {recipe.instructions.map((instruction, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${index + 1}. ${instruction}`}
                      />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 2 }}>
                  <Typography gutterBottom>Количество порций:</Typography>
                  <Slider
                    value={recipe.portions}
                    onChange={(_, value) => handlePortionChange(recipe.id, value as number)}
                    min={1}
                    max={10}
                    step={1}
                    marks
                  />
                </Box>
              </CardContent>
              <CardActions>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditRecipe(recipe.id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteRecipe(recipe.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </AppContainer>
  );
}

export default App;

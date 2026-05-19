from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User


class RegisterForm(UserCreationForm):
    first_name = forms.CharField(label='Имя', max_length=100, required=True,
        widget=forms.TextInput(attrs={'placeholder': 'Александр'}))
    last_name = forms.CharField(label='Фамилия', max_length=100, required=True,
        widget=forms.TextInput(attrs={'placeholder': 'Иванов'}))
    email = forms.EmailField(label='Email', required=True,
        widget=forms.EmailInput(attrs={'placeholder': 'example@mail.ru'}))
    grade = forms.ChoiceField(label='Класс', choices=User.Grade.choices, required=False)

    class Meta:
        model = User
        fields = ('username', 'last_name', 'first_name', 'email', 'grade', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs['placeholder'] = 'Логин'
        self.fields['username'].label = 'Логин'
        self.fields['password1'].widget.attrs['placeholder'] = '••••••••'
        self.fields['password2'].widget.attrs['placeholder'] = '••••••••'


class LoginForm(AuthenticationForm):
    username = forms.CharField(label='Логин или Email',
        widget=forms.TextInput(attrs={'placeholder': 'Ваш логин'}))
    password = forms.CharField(label='Пароль',
        widget=forms.PasswordInput(attrs={'placeholder': '••••••••'}))


class ProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'patronymic', 'email', 'grade', 'city', 'bio', 'avatar')
        labels = {
            'first_name': 'Имя', 'last_name': 'Фамилия',
            'email': 'Email', 'city': 'Город', 'bio': 'О себе',
        }

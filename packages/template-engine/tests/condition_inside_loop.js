const markup = `
{% for intake in intakes %}
  {% if intake.isOverDailyCalorieCount %}
  <tr class="bg-warning">
  {% else %}
  <tr>
  {% endif %}
    <th scope="row">{{ intake.id }}</th>
    <td>{{ intake.name }}</td>
    <td>{{ (new Date(intake.date_time)).toLocaleString() }}</td>
    <td>{{ intake.calories }}</td>
  </tr>
{% endfor %}
`;

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useDemoData } from '@mui/x-data-grid-generator';

function AdminFilter({ column, onFilterChange }) {
  const handleChange = (event) => {
    onFilterChange(event.target.value || null);
  };

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
      <InputLabel>{column.headerName}</InputLabel>
      <Select value={column.filterValue || ''} onChange={handleChange}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="true">True</MenuItem>
        <MenuItem value="false">False</MenuItem>
      </Select>
    </FormControl>
  );
}

export default function CustomDataGridWithFilters() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
    visibleFields: ['name', 'website', 'phone', 'isAdmin', 'salary'],
  });

  const [filterModel, setFilterModel] = React.useState({ items: [] });

  const handleFilterChange = (field, value) => {
    debugger;
    setFilterModel((prev) => ({
      items: value
        ? [...prev.items.filter((item) => item.field !== field), { field, operator: 'equals', value }]
        : prev.items.filter((item) => item.field !== field),
    }));
  };

  const columns = React.useMemo(
    () =>
      data.columns.map((colDef) => {
        if (colDef.field === 'isAdmin') {
          return {
            ...colDef,
            width: 200,
            renderHeader: () => (
              <AdminFilter column={colDef} onFilterChange={(value) => handleFilterChange(colDef.field, value)} />
            ),
            filterable:true,
            filterOperators:"is"
          };
        }
        return colDef;
      }),
    [data.columns]
  );

  return (
    <div style={{ height: 800, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        columns={columns}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
      />
    </div>
  );
}

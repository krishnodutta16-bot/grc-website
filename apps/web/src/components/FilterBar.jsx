import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const FilterBar = ({ filters, onFilterChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
      <div>
        <Label htmlFor="difficulty">Difficulty Level</Label>
        <Select 
          value={filters.difficulty || 'all'} 
          onValueChange={(value) => onFilterChange('difficulty', value)}
        >
          <SelectTrigger id="difficulty">
            <SelectValue placeholder="All levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="language">Language</Label>
        <Select 
          value={filters.language || 'all'} 
          onValueChange={(value) => onFilterChange('language', value)}
        >
          <SelectTrigger id="language">
            <SelectValue placeholder="All languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All languages</SelectItem>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="Mandarin">Mandarin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="partner">Partner University</Label>
        <Select 
          value={filters.partner || 'all'} 
          onValueChange={(value) => onFilterChange('partner', value)}
        >
          <SelectTrigger id="partner">
            <SelectValue placeholder="All partners" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All partners</SelectItem>
            {filters.partnerOptions?.map((partner) => (
              <SelectItem key={partner.id} value={partner.id}>
                {partner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status">Availability</Label>
        <Select 
          value={filters.status || 'all'} 
          onValueChange={(value) => onFilterChange('status', value)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="All workshops" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All workshops</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="full">Full</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;